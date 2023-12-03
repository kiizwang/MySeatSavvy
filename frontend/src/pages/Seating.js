import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../store/restaurantsSlice.js";
import { useNavigate, useLocation } from 'react-router-dom';
import moment from "moment";
import go, {SpecialDraggingTool} from 'gojs';
import Banner from "../components/Banner.js";

const Seating = () => {

  // To Get Query Params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantId = queryParams.get('restaurantId');
  const [restaurant, setRestaurant] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // Redux to fetch Restaurant Data
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.entities);
  const restaurantsStatus = useSelector((state) => state.restaurants.status);
  useEffect(() => {
    if (restaurantsStatus === "idle") {
      dispatch(fetchRestaurants());
    }
    if (restaurantsStatus === "succeeded") {
      const foundRestaurant = restaurants.find((r) => r._id === restaurantId);
      setRestaurant(foundRestaurant);
    }
  }, [restaurantsStatus, dispatch]);

  // Submit button's status
  useEffect(() => {
    // Check if "selectedTable" exists in sessionStorage
    const storedSelectedTable = JSON.parse(sessionStorage.getItem("selectedTable"));
    setIsSubmitEnabled(!!(storedSelectedTable && storedSelectedTable.id));
  }, []);

  const partySizeParam = queryParams.get('partySize');
  const dateParam = queryParams.get('date');
  const timeParam = queryParams.get('time');
  // Format date and time
  const dateTimeString = `${dateParam} ${timeParam}`; // Concatenate the date and time strings to form a complete datetime string
  const parsedDateTime = moment(dateTimeString, 'YYYY-MM-DD HH:mm');  // Create a moment object by parsing the datetime string
  const formattedDateTime = parsedDateTime.format('hh:mmA, ddd D MMM YYYY');  // Format the parsed datetime as required (including AM/PM for time)

  const navigate = useNavigate();
  const handleBack = () => {
    // Go back to the previous page
    navigate(-1);
  };

  const handleSubmit = () => {
    // Retrieve the selected table data from sessionStorage
    const storedSelectedTable = JSON.parse(sessionStorage.getItem("selectedTable"));

    if (storedSelectedTable && storedSelectedTable.id) {
      const tableSessionId = storedSelectedTable.id;
      // Navigate to the dinner page with the query parameters including the retrieved ID
      navigate(`/dinner?restaurantId=${restaurantId}&partySize=${partySizeParam}&date=${dateParam}&time=${timeParam}&selected_table=${tableSessionId}`);
      // Remove "selectedTable" from sessionStorage after navigation
      sessionStorage.removeItem("selectedTable");
    } 
  };

  const myDiagramRef = useRef(null);
  const [numberOfGuests] = useState(partySizeParam ? parseInt(partySizeParam) : 4); // 1 (user) + 2 (guests)
  const guestItems = [{ key: 'Guest', plus: numberOfGuests - 1 }];

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    //server-side API
    const apiUrl = 'http://localhost:4000/tables'; // API endpoint
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Set the retrieved data in the state
        setTableData(data);
        const tableWidth = 150; // Width of each table
        const tableHeight = 120; // Height of each table
        const tablesPerRow = 3; // Number of tables per row
        const rowSpacing = 60; // Space between rows
        const tableSpacing = 30; // Horizontal spacing between tables
      
        // Filter and map table data based on condition
        const nodeDataArray = data
        .filter(table => {
          if (numberOfGuests <=4 ) {
            return table.table_capacity.max >= 2 && table.table_capacity.max <= 4;
          } else {
            return table.table_capacity.max >= numberOfGuests;
          }
        })
        .map((table, index) => {
          const tableId = table._id;
          const x = 100 + (index % tablesPerRow) * (tableWidth + tableSpacing);
          const y = 100 + Math.floor(index / tablesPerRow) * (tableHeight + rowSpacing);

          // Determine the table category based on the max_capacity
          let category = "TableR4"; // Default to a square table with 4 seats
          if (table.table_capacity && table.table_capacity.max > 2 && table.table_capacity.max <= 8 ) {
            category = `TableR${table.table_capacity.max}`; // Change to a rectangular/square table with "table_capacity.max" seats
          }

          // Create data for the table with its specific tableId and category
          const tableData = {
            key: `table_${tableId}`,
            category: category,
            name: table.table_name,
            guests: {}, // Initialize with no guests
            loc: `${x} ${y}`,
          };
          return tableData;
        });
        // Check if myDiagramRef is already initialized
        if (!myDiagramRef.current) {
          // Call the init function with the reference to myDiagramRef
          const myDiagram = init();
          myDiagramRef.current = myDiagram;
          myDiagram.model = new go.GraphLinksModel(nodeDataArray);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });


    // Automatically drag people Nodes along with the table Node at which they are seated.
    class SpecialDraggingTool extends go.DraggingTool {
      computeEffectiveCollection(parts) {
        const map = super.computeEffectiveCollection(parts);
        // for each Node representing a table, also drag all of the people seated at that table
        parts.each(table => {
          if (isPerson(table)) return;  // ignore persons
          // this is a table Node, find all people Nodes using the same table key
          for (const nit = table.diagram.nodes; nit.next();) {
            const n = nit.value;
            if (isPerson(n) && n.data.table === table.data.key) {
              if (!map.has(n)) map.add(n, new go.DraggingInfo(n.location.copy()));
            }
          }
        });
        return map;
      }
    }
    // end SpecialDraggingTool

    // Automatically move seated people as a table is rotated, to keep them in their seats.
      // Note that because people are separate Nodes, rotating a table Node means the people Nodes
      // are not rotated, so their names (TextBlocks) remain horizontal.
      class HorizontalTextRotatingTool extends go.RotatingTool {
        rotate(newangle) {
          super.rotate(newangle);
          const node = this.adornedObject.part;
          positionPeopleAtSeats(node);
        }
      }
      // end HorizontalTextRotatingTool
      const myDiagramDiv = document.getElementById("myDiagramDiv");
    // GoJS diagram initialization
      function init() {
        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make;

        // Initializing myDiagram as empty object
        let myDiagram = {};
        if (myDiagram) {
          myDiagram.div = null; // Remove the div association
          myDiagram = null; // Dispose of the diagram
        }
        // Clear the div's content before creating a new diagram

        myDiagramDiv.innerHTML = "";

        // Initialize the main Diagram
        myDiagram =
          new go.Diagram("myDiagramDiv",
            {
              allowDragOut: true,  // to myGuests
              allowClipboard: false,
              draggingTool: $(SpecialDraggingTool),
              rotatingTool: $(HorizontalTextRotatingTool),
              // For this sample, automatically show the state of the diagram's model on the page
              "ModelChanged": e => {
                if (e.isTransactionFinished) {
                  document.getElementById("savedModel").textContent = myDiagram.model.toJson();
                }
              },
              "undoManager.isEnabled": true
            });

        myDiagram.nodeTemplateMap.add("",  // default template, for people
          $(go.Node, "Auto",
            { background: "transparent" },  // in front of all Tables
            // when selected is in foreground layer
            new go.Binding("layerName", "isSelected", s => s ? "Foreground" : "").ofObject(),
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // $(go.TextBlock, { margin: 2, desiredSize: new go.Size(3, NaN), font: "8pt Verdana, sans-serif", textAlign: "center", stroke: "darkblue" },
            new go.Binding("text", "name"),// Bind the text to the "name" property
            { // what to do when a drag-over or a drag-drop occurs on a Node representing a table
              mouseDragEnter: (e, node, prev) => {
                const dragCopy = node.diagram.toolManager.draggingTool.copiedParts;  // could be copied from palette
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, true);
              },
              mouseDragLeave: (e, node, next) => {
                const dragCopy = node.diagram.toolManager.draggingTool.copiedParts;
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, false);
              },
              mouseDrop: (e, node) => {
                assignPeopleToSeats(node, node.diagram.selection, e.documentPoint);
              }
            },
            $(go.Shape, "RoundedRectangle", { name: "guestsRoundedRect", width: 55, height: 25, fill: "#FFD604", stroke: null, parameter1: 4  }),
            $(go.Panel, "Viewbox",
              { desiredSize: new go.Size(47, 40) },
              $(go.TextBlock, { name: "guestsTextBlock", margin: 1, desiredSize: new go.Size(55, NaN), font: "bold 8pt Verdana, sans-serif", textAlign: "center", stroke: "#000000" },
                new go.Binding("text", "", data => {
                  let s = data.key;
                  if (data.plus) s += " +" + data.plus.toString();
                  return s;
                }))
            )
          ));

        // Create a seat element at a particular alignment relative to the table.
        function Seat(number, align, focus, table) {
          if (typeof align === 'string') align = go.Spot.parse(align);
          if (!align || !align.isSpot()) align = go.Spot.Right;
          if (typeof focus === 'string') focus = go.Spot.parse(focus);
          if (!focus || !focus.isSpot()) focus = align.opposite();
          return $(go.Panel, "Spot",
            {
              name: number.toString(),
              alignment: align,
              alignmentFocus: focus,
              padding: new go.Margin(5, 8) // Padding for space around the seat
            },
            $(go.Shape, "Rectangle",
            {
              name: "SEATSHAPE",
              desiredSize: new go.Size(25, 8),
              fill: "none",
              stroke: "#FFD604",
              strokeWidth: 1,
              // Adjust corner radius
              geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"
            },
              new go.Binding("fill"))
          );
        }

        function tableStyle() {
          return [
            { background: "transparent" },
            { layerName: "Background" },  // behind all Persons
            { locationSpot: go.Spot.Center, locationObjectName: "TABLESHAPE" },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { rotatable: true },
            new go.Binding("angle").makeTwoWay(),
            { // what to do when a drag-over or a drag-drop occurs on a Node representing a table
              mouseDragEnter: (e, node, prev) => {
                const dragCopy = node.diagram.toolManager.draggingTool.copiedParts;  // could be copied from palette
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, true);
              },
              mouseDragLeave: (e, node, next) => {
                const dragCopy = node.diagram.toolManager.draggingTool.copiedParts;
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, false);
              },
              mouseDrop: (e, node) => { assignPeopleToSeats(node, node.diagram.selection, e.documentPoint)}
            }
          ];
        }

        // various kinds of tables:
        myDiagram.nodeTemplateMap.add("TableR3",  // rectangular with 3 seats in a line
          $(go.Node, "Spot", tableStyle(),
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle",
                { name: "TABLESHAPE", desiredSize: new go.Size(160, 60), fill: "#1B1A1F", stroke: "#FFD604",
                // Adjust corner radius 
                geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                new go.Binding("fill")),
              $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 11pt Verdana, sans-serif", stroke: "#FFFFFF" },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("angle", "angle", n => -n))
            ),
            Seat(1, "0.2 0", "0.5 1","TableR3"),
            Seat(2, "0.5 0", "0.5 1","TableR3"),
            Seat(3, "0.8 0", "0.5 1","TableR3")
          ));

        myDiagram.nodeTemplateMap.add("TableR4",  // square with 4 seats
          $(go.Node, "Spot", tableStyle(),
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle",
                { name: "TABLESHAPE", desiredSize: new go.Size(70, 70), fill: "#1B1A1F", stroke: "#FFD604",
                // Adjust corner radius
                geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                new go.Binding("fill")),
              $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 8pt Verdana, sans-serif", stroke: "#FFFFFF" },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("angle", "angle", n => -n))
            ),
            Seat(1, "0.25 0", "0.5 1", "TableR4"),
            Seat(2, "0.72 0", "0.5 1", "TableR4"),
            Seat(3, "0.25 1.20", "0.5 0.8","TableR4"),
            Seat(4, "0.72 1.20", "0.5 0.8", "TableR4")
          ));

        myDiagram.nodeTemplateMap.add("TableR5",  // rectangular with 5 seats
          $(go.Node, "Spot", tableStyle(),
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle",
                { name: "TABLESHAPE", desiredSize: new go.Size(150, 70), fill: "#1B1A1F", stroke: "#FFD604",
                // Adjust corner radius 
                geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                new go.Binding("fill")),
              $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 11pt Verdana, sans-serif", stroke: "#FFFFFF" },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("angle", "angle", n => -n))
            ),
            Seat(1, "0.2 0", "0.5 1","TableR5"),
            Seat(2, "0.5 0", "0.5 1","TableR5"),
            Seat(3, "0.8 0", "0.5 1","TableR5"),
            Seat(4, "0.7 1", "0.5 0","TableR5"),
            Seat(5, "0.3 1", "0.5 0","TableR5")
          ));

        myDiagram.nodeTemplateMap.add("TableR6",  // square with 6 seats
        $(go.Node, "Spot", tableStyle(),
          $(go.Panel, "Spot",
            $(go.Shape, "Rectangle",
              { name: "TABLESHAPE", desiredSize: new go.Size(150, 70), fill: "#1B1A1F", stroke: "#FFD604",
              // Adjust corner radius 
              geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              new go.Binding("fill")),
            $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 11pt Verdana, sans-serif", stroke: "#FFFFFF" },
              new go.Binding("text", "name").makeTwoWay(),
              new go.Binding("angle", "angle", n => -n))
          ),
            Seat(1, "0.2 0", "0.5 1","TableR6"),
            Seat(2, "0.5 0", "0.5 1","TableR6"),
            Seat(3, "0.8 0", "0.5 1","TableR6"),
            Seat(4, "0.8 1", "0.5 0","TableR6"),
            Seat(5, "0.5 1", "0.5 0","TableR6"),
            Seat(6, "0.2 1", "0.5 0","TableR6"),
          ));

        myDiagram.nodeTemplateMap.add("TableR7",  // square with 7 seats
          $(go.Node, "Spot", tableStyle(),
            $(go.Panel, "Spot",
            $(go.Shape, "Rectangle",
              { name: "TABLESHAPE", desiredSize: new go.Size(150, 70), fill: "#1B1A1F", stroke: "#FFD604",
              // Adjust corner radius 
              geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              new go.Binding("fill")),
            $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 11pt Verdana, sans-serif", stroke: "#FFFFFF" },
              new go.Binding("text", "name").makeTwoWay(),
              new go.Binding("angle", "angle", n => -n))
            ),
            Seat(1, "0.2 0", "0.5 1","TableR7"),
            Seat(2, "0.4 0", "0.5 1","TableR7"),
            Seat(3, "0.6 0", "0.5 1","TableR7"),
            Seat(4, "0.8 0", "0.5 1","TableR7"),
            Seat(5, "0.8 1", "0.5 0","TableR7"),
            Seat(6, "0.5 1", "0.5 0","TableR7"),
            Seat(7, "0.2 1", "0.5 0","TableR7"),
            Seat(7, "0.2 1", "0.5 0","TableR7"),
          ));

        myDiagram.nodeTemplateMap.add("TableR8",  // rectangular with 8 seats
          $(go.Node, "Spot", tableStyle(),
            $(go.Panel, "Spot",
              $(go.Shape, "Rectangle",
                { name: "TABLESHAPE", desiredSize: new go.Size(150, 70), fill: "#1B1A1F", stroke: "#FFD604",
                // Adjust corner radius
                geometryString: "M0,2.5 Q0,0 2.5,0 L27.5,0 Q30,0 30,2.5 L30,7.5 Q30,10 27.5,10 L2.5,10 Q0,10 0,7.5 Z"},
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                new go.Binding("fill")),
              $(go.TextBlock, { name: "TextBlock", editable: true, font: "bold 11pt Verdana, sans-serif", stroke: "#FFFFFF" },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("angle", "angle", n => -n))
            ),
            Seat(1, "0.2 0", "0.5 1","TableR8"),
            Seat(2, "0.4 0", "0.5 1","TableR8"),
            Seat(3, "0.6 0", "0.5 1","TableR8"),
            Seat(4, "0.8 0", "0.5 1","TableR8"),
            Seat(5, "0.8 1", "0.5 0","TableR8"),
            Seat(6, "0.6 1", "0.5 0","TableR8"),
            Seat(7, "0.4 1", "0.5 0","TableR8"),
            Seat(8, "0.2 1", "0.5 0","TableR8"),
          ));

        // what to do when a drag-drop occurs in the Diagram's background
        myDiagram.mouseDrop = e => {
          // when the selection is dropped in the diagram's background,
          // make sure the selected people no longer belong to any table
          e.diagram.selection.each(n => {
            if (isPerson(n)) unassignSeat(n.data);
          });
        };

        // to simulate a "move" from the Palette, the source Node must be deleted.
        myDiagram.addDiagramListener("ExternalObjectsDropped", e => {
          // if any Tables were dropped, don't delete from myGuests
          if (!e.subject.any(isTable)) {
            myGuests.commandHandler.deleteSelection();
          }
        });

        // put deleted people back in the myGuests diagram
        myDiagram.addDiagramListener("SelectionDeleted", e => {
          // no-op if deleted by myGuests' ExternalObjectsDropped listener
          if (myDiagram.disableSelectionDeleted) return;
          // e.subject is the myDiagram.selection collection
          e.subject.each(n => {
            if (isPerson(n)) {
              myGuests.model.addNodeData(myGuests.model.copyNodeData(n.data));
            }
          });
        });


        // initialize the Palette
        let myGuests =
          new go.Diagram("myGuests",
            {
              layout: $(go.GridLayout,
                {
                  sorting: go.GridLayout.Ascending  // sort by Node.text value
                }),
              allowDragOut: true,  // to myDiagram
              allowMove: false
            });

        myGuests.nodeTemplateMap = myDiagram.nodeTemplateMap;

        // specify the contents of the Palette
        // Create the palette model with the dynamically generated guest items
        myGuests.model = new go.GraphLinksModel(guestItems);

        myGuests.model.undoManager = myDiagram.model.undoManager  // shared UndoManager!

        // To simulate a "move" from the Diagram back to the Palette, the source Node must be deleted.
        myGuests.addDiagramListener("ExternalObjectsDropped", e => {
          // e.subject is the myGuests.selection collection
          // if the user dragged a Table to the myGuests diagram, cancel the drag
          if (e.subject.any(isTable)) {
            myDiagram.currentTool.doCancel();
            myGuests.currentTool.doCancel();
            return;
          }
          myDiagram.selection.each(n => {
            if (isPerson(n)) unassignSeat(n.data);
          });
          myDiagram.disableSelectionDeleted = true;
          myDiagram.commandHandler.deleteSelection();
          myDiagram.disableSelectionDeleted = false;
          myGuests.selection.each(n => {
            if (isPerson(n)) unassignSeat(n.data);
          });
        });

        go.AnimationManager.defineAnimationEffect("location",
          (obj, startValue, endValue, easing, currentTime, duration, animationState) => {
            obj.location = new go.Point(easing(currentTime, startValue.x, endValue.x - startValue.x, duration),
              easing(currentTime, startValue.y, endValue.y - startValue.y, duration));
          }
        );
        return myDiagram;
      } // end init

      function isPerson(n) { return n !== null && n.category === ""; }

      function isTable(n) { return n !== null && n.category !== ""; }

      // Highlight the empty and occupied seats at a "Table" Node
      function highlightSeats(node, coll, show) {
        if (isPerson(node)) {  // refer to the person's table instead
          node = node.diagram.findNodeForKey(node.data.table);
          if (node === null) return;
        }
        const it = coll.iterator;
        while (it.next()) {
          const n = it.key;
          // if dragging a Table, don't do any highlighting
          if (isTable(n)) return;
        }
        const guests = node.data.guests;
        for (const sit = node.elements; sit.next();) {
          const seat = sit.value;
          if (seat.name) {
            const num = parseFloat(seat.name);
            if (isNaN(num)) continue;
            const seatshape = seat.findObject("SEATSHAPE");
            if (!seatshape) continue;
            if (show) {
              if (guests[seat.name]) {
                seatshape.stroke = "red";
              } else {
                seatshape.stroke = "green";
              }
            } else {
              seatshape.stroke = "white";
            }
          }
        }
      }

      // Given a "Table" Node, assign seats for all of the people in the given collection of Nodes;
      // the optional Point argument indicates where the collection of people may have been dropped.
      function assignPeopleToSeats(node, coll, pt) {
        if (isPerson(node)) {
          // refer to the person's table instead
          node = node.diagram.findNodeForKey(node.data.table);
          if (node === null) return;
        }
        if (coll.any(isTable)) {
          // if dragging a Table, don't allow it to be dropped onto another table
          myDiagramRef.current.currentTool.doCancel();
          return;
        }
        // OK -- all Nodes are people, call assignSeat on each person data
        coll.each((n) => assignSeat(node, n.data, pt));
        positionPeopleAtSeats(node);
      }

      // Given a "Table" Node, assign one guest data to a seat at that table.
      // Also handles cases where the guest represents multiple people, because guest.plus > 0.
      // This tries to assign the unoccupied seat that is closest to the given point in document coordinates.
      function assignSeat(node, guest, pt) {
        if (isPerson(node)) {  // refer to the person's table instead
          node = node.diagram.findNodeForKey(node.data.table);
          if (node === null) return;
        }
        if (guest instanceof go.GraphObject) throw Error("A guest object must not be a GraphObject: " + guest.toString());
        if (!(pt instanceof go.Point)) pt = node.location;

        // in case the guest used to be assigned to a different seat, perhaps at a different table
        unassignSeat(guest);

        const model = node.diagram.model;
        const guests = node.data.guests;

        // Saving the selected table in the session
        const selectedTable = {
          id: node.data.key.substring(node.data.key.indexOf('_') + 1),
          category: node.data.category,
          name : node.data.name
        }
        // Session Storage for Selected Table
        sessionStorage.setItem("selectedTable", JSON.stringify(selectedTable));

        // Update isSubmitEnabled state
        setIsSubmitEnabled(true);

        // iterate over all seats in the Node to find one that is not occupied
        const closestseatname = findClosestUnoccupiedSeat(node, pt);
        if (closestseatname) {
          model.setDataProperty(guests, closestseatname, guest.key);
          model.setDataProperty(guest, "table", node.data.key);
          model.setDataProperty(guest, "seat", parseFloat(closestseatname));
        }

        const plus = guest.plus;
        if (plus) {  // represents several people
          // forget the "plus" info, since next we create N copies of the node/data
          guest.plus = undefined;
          model.updateTargetBindings(guest);
          for (let i = 0; i < plus; i++) {
            const copy = model.copyNodeData(guest);
            // don't copy the seat assignment of the first person
            copy.table = undefined;
            copy.seat = undefined;
            model.addNodeData(copy);
            assignSeat(node, copy, pt);
          }
        }
      }

      // Declare that the guest represented by the data is no longer assigned to a seat at a table.
      // If the guest had been at a table, the guest is removed from the table's list of guests.
      function unassignSeat(guest) {
        if (guest instanceof go.GraphObject) throw Error("A guest object must not be a GraphObject: " + guest.toString());
        const model = myDiagramRef.current.model; // Change here

        // remove from any table that the guest is assigned to
        if (guest.table) {
          const table = model.findNodeDataForKey(guest.table);
          if (table) {
            const guests = table.guests;
            if (guests) model.setDataProperty(guests, guest.seat.toString(), undefined);
          }
        }

        model.setDataProperty(guest, "table", undefined);
        model.setDataProperty(guest, "seat", undefined);
      }


      // Find the name of the unoccupied seat that is closest to the given Point.
      // This returns null if no seat is available at this table.
      function findClosestUnoccupiedSeat(node, pt) {
        if (isPerson(node)) {  // refer to the person's table instead
          node = node.diagram.findNodeForKey(node.data.table);
          if (node === null) return;
        }
        const guests = node.data.guests;
        let closestseatname = null;
        let closestseatdist = Infinity;
        // iterate over all seats in the Node to find one that is not occupied
        for (const sit = node.elements; sit.next();) {
          const seat = sit.value;
          if (seat.name) {
            const num = parseFloat(seat.name);
            if (isNaN(num)) continue;  // not really a "seat"
            if (guests[seat.name]) continue;  // already assigned
            const seatloc = seat.getDocumentPoint(go.Spot.Center);
            const seatdist = seatloc.distanceSquaredPoint(pt);
            if (seatdist < closestseatdist) {
              closestseatdist = seatdist;
              closestseatname = seat.name;
            }
          }
        }
        return closestseatname;
      }

      // Position the nodes of all of the guests that are seated at this table
      // to be at their corresponding seat elements of the given "Table" Node.
      function positionPeopleAtSeats(node) {
        if (isPerson(node)) {  // refer to the person's table instead
          node = node.diagram.findNodeForKey(node.data.table);
          if (node === null) return;
        }
        const guests = node.data.guests;
        const model = node.diagram.model;
        for (let seatname in guests) {
          const guestkey = guests[seatname];
          const guestdata = model.findNodeDataForKey(guestkey);
          positionPersonAtSeat(guestdata);
        }
      }

      // Find the table node by its unique ID (tableId)
      function findTableNodeById(tableId) {
        const diagram = myDiagramRef.current; // Reference to diagram
        let tableNode = null;

        // Iterate through each node in the diagram
        diagram.nodes.each((node) => {
          // Check if the node key matches the specified tableId
          if (node.data && node.data.key === `${tableId}`) {
            tableNode = node; // Found the table node with the specified tableId
            return false; // Exit the iteration loop
          }
        });

        return tableNode; // Return the found table node or null if not found
      }

      // Position a single guest Node to be at the location of the seat to which they are assigned.
      // Position a single guest Node to be at the location of the seat to which they are assigned.
      function positionPersonAtSeat(guest) {
        if (guest instanceof go.GraphObject) throw Error("A guest object must not be a GraphObject: " + guest.toString());
        if (!guest || !guest.table || !guest.seat) return;

        const diagram = myDiagramRef.current; // Change here
        const table = diagram.findPartForKey(guest.table);
        const person = diagram.findPartForData(guest);


        if (table && person) {
          const seat = table.findObject(guest.seat.toString());
          const loc = seat.getDocumentPoint(go.Spot.Center);

          //  For Seats Selected
          // Access the Selected RoundedRectangle shape inside the node
          const guestsRoundedRect = person.findObject("guestsRoundedRect");
          if (guestsRoundedRect) {
            // Modify width and height of the RoundedRectangle shape
            diagram.startTransaction('changeGuestsRoundedRect');
            guestsRoundedRect.width = 25; // Change the width 
            guestsRoundedRect.height = 8; // Change the height 
            // Access the TextBlock inside the RoundedRectangle's panel
            const textBlock = guestsRoundedRect.panel.findObject("guestsTextBlock");  
            if (textBlock instanceof go.TextBlock) {
              // Change the color of the text block
              textBlock.stroke = "#FFD604"; 
            }
            diagram.commitTransaction('changeGuestsRoundedRect');
          }

          // For Table Selected
          const foundTableNode = findTableNodeById(table.key);
          if (foundTableNode) {
            // Modify the found table node 
            diagram.startTransaction('modifySelectedTable');
            const tableShape = foundTableNode.findObject("TABLESHAPE"); 
            if (tableShape instanceof go.Shape) {
              // tableShape.stroke = "green";
              // Accessing the TextBlock inside the table node
              const textBlock = foundTableNode.findObject("TextBlock"); 
              if (textBlock instanceof go.TextBlock) {
                textBlock.stroke = "#FFD604"; // Change the text color
              } 
            } 
            diagram.commitTransaction('modifySelectedTable');
          }

          // animate movement, instead of: person.location = loc;
          const animation = new go.Animation();
          animation.add(person, "location", person.location, loc);
          animation.start();
        }
      }


      window.addEventListener('DOMContentLoaded', init);

      // Cleanup when the component unmounts
      return () => {
        if (myDiagramRef.current) {
          myDiagramRef.current.div = null;
          myDiagramRef.current = null;
        }
      };
  }, []);
  return (
    <main>
      <div className="main main-seating">
        <Banner bannerImage={restaurant ? restaurant.banner_image : ""} />
        <div className="content">
          <section className="seating-info">
            <h1>{restaurant ? restaurant.name : "Loading..."}</h1>
            <div className="restaurant-info-wrapping">
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">face</span>
                </div>
                <p>{`${numberOfGuests} Adults`}</p>
              </div>
              <div className="icon-p-wrapper">
                <div className="icon-wrapper">
                  <span className="material-icons-outlined material-symbols-outlined">calendar_month</span>
                </div>
                <p>{`${formattedDateTime}`}</p>
              </div>
            </div>
          </section>

          <section className="seating-selection">
            <div className="restaurant-content-wrapping">
              <h2>Seating Reservation</h2>
              <div id="myFlexDiv">
                <div
                  id="myGuests"
                  style={{
                    border: "1px solid black",
                    position: "relative",
                    WebkitTapHighlightColor: "rgba(255, 255, 255, 0)",
                    background: "#1B1A1F 0% 0% no-repeat padding-box",
                    borderRadius: "8px",
                  }}
                >
                  <canvas
                    tabIndex="0"
                    width="122"
                    height="622"
                    style={{
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      zIndex: 2,
                      userSelect: "none",
                      touchAction: "none",
                      width: "98px",
                      height: "498px",
                    }}
                  ></canvas>
                  <div style={{ position: "absolute", overflow: "auto", width: "98px", height: "498px", zIndex: 1 }}>
                    <div style={{ position: "absolute", width: "1px", height: "1px" }}></div>
                  </div>
                </div>

                <div
                  id="myDiagramDiv"
                  style={{
                    border: "1px solid black",
                    position: "relative",
                    WebkitTapHighlightColor: "rgba(255, 255, 255, 0)",
                    background: "#1B1A1F 0% 0% no-repeat padding-box",
                    borderRadius: "8px",
                  }}
                >
                  <canvas
                    tabIndex="0"
                    width="1180"
                    height="622"
                    style={{
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      zIndex: 2,
                      userSelect: "none",
                      touchAction: "none",
                      width: "944px",
                      height: "498px",
                    }}
                  ></canvas>
                  <div style={{ position: "absolute", overflow: "auto", width: "944px", height: "498px", zIndex: 1 }}>
                    <div style={{ position: "absolute", width: "1px", height: "1px" }}></div>
                  </div>
                </div>
              </div>
              <div>
                <pre id="savedModel" style={{ height: "250px", display: "none" }}></pre>
              </div>
              <div className="seating-btn-grid">
                <input type="submit" value="Back" className={`btn btn-default btn-seating-back`} onClick={handleBack} />
                <input
                  type="submit"
                  value="Submit"
                  className={`btn btn-warning btn-seating-submit ${!isSubmitEnabled ? "disabled" : ""}`}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Seating