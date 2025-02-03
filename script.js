// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process data - group by employee and calculate total hours
//     const employees = d3.rollup(data,
//         v => ({
//             totalHours: d3.sum(v, d => +d.Duration_Hours),
//             tasks: v,
//             shiftStart: d3.min(v, d => d.ShiftStart),
//             shiftEnd: d3.min(v, d => d.ShiftEnd)
//         }),
//         d => d.EmployeeID
//     );

//     const nodes = Array.from(employees, ([id, details]) => ({
//         id,
//         ...details,
//         radius: Math.sqrt(details.totalHours) * 4,
//         category: d3.max(details.tasks, d => d.TaskCategory)
//     }));

//     // Create simulation
//     const simulation = d3.forceSimulation(nodes)
//         .force("charge", d3.forceManyBody().strength(5))
//         .force("collide", d3.forceCollide().radius(d => d.radius + 2))
//         .force("center", d3.forceCenter(width / 2, height / 2))
//         .force("x", d3.forceX(width / 2).strength(0.05))
//         .force("y", d3.forceY(height / 2).strength(0.05));

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Create bubbles
//     const bubbles = svg.selectAll("circle")
//         .data(nodes)
//         .enter().append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill", d => colorScale(d.category));

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     // Add interaction
//     bubbles.on("mouseover", (event, d) => {
//             tooltip.transition()
//                 .style("opacity", 0.9);
//             tooltip.html(`Employee: ${d.id}<br>
//                         Total Hours: ${d.totalHours.toFixed(2)}<br>
//                         Shift: ${d.shiftStart} - ${d.shiftEnd}<br>
//                         Main Task: ${d.category}`)
//                 .style("left", (event.pageX + 10) + "px")
//                 .style("top", (event.pageY - 28) + "px");
//         })
//         .on("mouseout", () => {
//             tooltip.transition().style("opacity", 0);
//         });

//     // Update positions
//     simulation.on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Add periodic movement
//     setInterval(() => {
//         simulation.force("x", d3.forceX(Math.random() * width).strength(0.05));
//         simulation.force("y", d3.forceY(Math.random() * height).strength(0.05));
//         simulation.alpha(0.3).restart();
//     }, 3000);

//     // Add legend
//     const legend = svg.selectAll(".legend")
//         .data(colorScale.domain())
//         .enter().append("g")
//         .attr("class", "legend")
//         .attr("transform", (d, i) => `translate(20,${20 + i * 20})`);

//     legend.append("rect")
//         .attr("width", 18)
//         .attr("height", 18)
//         .style("fill", colorScale);

//     legend.append("text")
//         .attr("x", 24)
//         .attr("y", 9)
//         .attr("dy", ".35em")
//         .text(d => d);
// });



// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     const categories = [...new Set(data.map(d => d.TaskCategory))];

//     // Create category positions (in a grid layout)
//     const categoryPositions = {};
//     const columns = Math.ceil(Math.sqrt(categories.length));
//     const rows = Math.ceil(categories.length / columns);
//     categories.forEach((category, i) => {
//         const col = i % columns;
//         const row = Math.floor(i / columns);
//         categoryPositions[category] = {
//             x: (width * (col + 1)) / (columns + 1),
//             y: (height * (row + 1)) / (rows + 1)
//         };
//     });

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data(categories)
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels
//     svg.selectAll(".category-label")
//         .data(categories)
//         .enter()
//         .append("text")
//         .attr("class", "category-label")
//         .attr("x", category => categoryPositions[category].x)
//         .attr("y", category => categoryPositions[category].y - 80)
//         .attr("text-anchor", "middle")
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Create timer display
//     const timerDisplay = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "timer")
//         .style("position", "fixed")
//         .style("top", "20px")
//         .style("left", "20px")
//         .style("font-size", "24px")
//         .style("font-weight", "bold")
//         .style("background-color", "rgba(255,255,255,0.8)")
//         .style("padding", "10px")
//         .style("border-radius", "5px")
//         .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-10)) // Reduced repulsion
//         .force("collide", d3.forceCollide().radius(12).strength(0.9)) // Increased collision strength
//         .force("x", d3.forceX().strength(0.7)) // Increased x-force
//         .force("y", d3.forceY().strength(0.7)); // Increased y-force

//     // Create nodes for each employee
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 10, // Slightly reduced radius
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5); // Reduced stroke width

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     // Time animation
//     const startTime = parseTime("08:00");
//     const endTime = parseTime("23:55");
//     let currentTime = startTime;

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Start animation - increment by 10 minutes
//     const timeInterval = setInterval(() => {
//         currentTime += 600;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);

//         if (currentTime >= endTime) {
//             clearInterval(timeInterval);
//         }
//     }, 1000);

//     // Add legend for categories
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data(categories)
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
// });



// // Configuration
// const width = window.innerWidth;
// const height = window.innerHeight;
// const colorScale = d3.scaleOrdinal(d3.schemeSet3);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory.trim(),
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     const categories = [...new Set(data.map(d => d.TaskCategory.trim()))];
//     console.log("Categories:", categories);

//     // Calculate circular layout positions
//     const radius = Math.min(width, height) * 0.35;
//     const categoryPositions = {};
//     categories.forEach((category, i) => {
//         const angle = (i * 2 * Math.PI) / categories.length;
//         categoryPositions[category] = {
//             x: width/2 + radius * Math.cos(angle),
//             y: height/2 + radius * Math.sin(angle)
//         };
//     });

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .style("background-color", "black");

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data(categories)
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", category => category === "Misc" ? 40 : 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", d => d === "Misc" ? 0.6 : 0.3);

//     // Add category labels
//     categories.forEach((category, i) => {
//         const angle = (i * 2 * Math.PI) / categories.length;
//         const labelRadius = radius + 40;
//         const x = width/2 + labelRadius * Math.cos(angle);
//         const y = height/2 + labelRadius * Math.sin(angle);
        
//         let rotationAngle = (angle * 180 / Math.PI) + 90;
//         if (angle > Math.PI) {
//             rotationAngle += 180;
//         }

//         svg.append("text")
//             .attr("class", "category-label")
//             .attr("x", x)
//             .attr("y", y)
//             .attr("text-anchor", "middle")
//             .attr("transform", `rotate(${rotationAngle},${x},${y})`)
//             .style("font-size", "14px")
//             .style("font-weight", "bold")
//             .style("fill", "white")
//             .text(category);
//     });

//     // Create timer display
//     const timerDisplay = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "timer")
//         .style("position", "fixed")
//         .style("top", "20px")
//         .style("left", "20px")
//         .style("font-size", "24px")
//         .style("font-weight", "bold")
//         .style("color", "white")
//         .style("background-color", "rgba(0,0,0,0.8)")
//         .style("padding", "10px")
//         .style("border-radius", "5px")
//         .style("border", "1px solid rgba(255,255,255,0.2)")
//         .style("box-shadow", "0 0 10px rgba(0,0,0,0.5)");

//     // Create simulation
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-15))
//         .force("collide", d3.forceCollide().radius(12).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes for each employee
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 10,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill", "white")
//         .style("fill-opacity", 0.6)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Create tooltip
//     const tooltip = d3.select("body")
//         .append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "rgba(0,0,0,0.8)")
//         .style("color", "white")
//         .style("padding", "8px")
//         .style("border-radius", "4px")
//         .style("font-size", "12px")
//         .style("pointer-events", "none");

//     // Update positions function
//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles
//             .style("fill", d => colorScale(d.category || "none"))
//             .style("fill-opacity", d => d.category === "Misc" ? 0.8 : 0.6);

//         simulation
//             .force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 180}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data(categories)
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 25})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 25)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px")
//         .style("fill", "white");

//     // Add interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Start animation with 1-minute increments
//     const startTime = parseTime("08:00");
//     const endTime = parseTime("17:00");
//     let currentTime = startTime;

//     const timeInterval = setInterval(() => {
//         currentTime += 60; // Changed from 600 to 60 for 1-minute increments
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);

//         if (currentTime >= endTime) {
//             clearInterval(timeInterval);
//         }
//     }, 1000); // Updates every second in real-time
// });







// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     const categories = [...new Set(data.map(d => d.TaskCategory))];

//     // Create category positions (in a grid layout)
//     const categoryPositions = {};
//     const columns = Math.ceil(Math.sqrt(categories.length));
//     const rows = Math.ceil(categories.length / columns);
//     categories.forEach((category, i) => {
//         const col = i % columns;
//         const row = Math.floor(i / columns);
//         categoryPositions[category] = {
//             x: (width * (col + 1)) / (columns + 1),
//             y: (height * (row + 1)) / (rows + 1)
//         };
//     });

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data(categories)
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels
//     svg.selectAll(".category-label")
//         .data(categories)
//         .enter()
//         .append("text")
//         .attr("class", "category-label")
//         .attr("x", category => categoryPositions[category].x)
//         .attr("y", category => categoryPositions[category].y - 80)
//         .attr("text-anchor", "middle")
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Create timer display
//     const timerDisplay = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "timer")
//         .style("position", "fixed")
//         .style("top", "20px")
//         .style("left", "20px")
//         .style("font-size", "24px")
//         .style("font-weight", "bold")
//         .style("background-color", "rgba(255,255,255,0.8)")
//         .style("padding", "10px")
//         .style("border-radius", "5px")
//         .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-10)) // Reduced repulsion
//         .force("collide", d3.forceCollide().radius(12).strength(0.9)) // Increased collision strength
//         .force("x", d3.forceX().strength(0.7)) // Increased x-force
//         .force("y", d3.forceY().strength(0.7)); // Increased y-force

//     // Create nodes for each employee
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 10, // Slightly reduced radius
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5); // Reduced stroke width

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     // Time animation
//     const startTime = parseTime("08:00");
//     const endTime = parseTime("23:55");
//     let currentTime = startTime;

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Start animation - increment by 10 minutes
//     const timeInterval = setInterval(() => {
//         currentTime += 600;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);

//         if (currentTime >= endTime) {
//             clearInterval(timeInterval);
//         }
//     }, 1000);

//     // Add legend for categories
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data(categories)
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
// });







// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
    
//     // Remove 'Misc' from categories array if it exists and add it separately
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35; // Radius for the circle
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     // Position categories in a circle
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2; // Start from top (-90 degrees)
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     // Add center position for 'Misc'
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels
//     svg.selectAll(".category-label")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("text")
//         .attr("class", "category-label")
//         .attr("x", category => categoryPositions[category].x)
//         .attr("y", category => categoryPositions[category].y - 80)
//         .attr("text-anchor", "middle")
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Rest of your code remains the same...
//     // Create timer display
//     const timerDisplay = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "timer")
//         .style("position", "fixed")
//         .style("top", "20px")
//         .style("left", "20px")
//         .style("font-size", "24px")
//         .style("font-weight", "bold")
//         .style("background-color", "rgba(255,255,255,0.8)")
//         .style("padding", "10px")
//         .style("border-radius", "5px")
//         .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-10))
//         .force("collide", d3.forceCollide().radius(12).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes for each employee
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 10,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     // Time animation
//     const startTime = parseTime("08:00");
//     const endTime = parseTime("23:55");
//     let currentTime = startTime;

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Start animation
//     const timeInterval = setInterval(() => {
//         currentTime += 600;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);

//         if (currentTime >= endTime) {
//             clearInterval(timeInterval);
//         }
//     }, 1000);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
// });





// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
    
//     // Remove 'Misc' from categories array if it exists and add it separately
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35; // Radius for the circle
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     // Position categories in a circle
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2; // Start from top (-90 degrees)
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     // Add center position for 'Misc'
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.01);

//     // Add category labels
//     svg.selectAll(".category-label")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("text")
//         .attr("class", "category-label")
//         .attr("x", category => categoryPositions[category].x)
//         .attr("y", category => categoryPositions[category].y - 80)
//         .attr("text-anchor", "middle")
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Create timer display
//     const timerDisplay = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "timer");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-5))
//         .force("collide", d3.forceCollide().radius(6).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes for each employee
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     // Time animation
//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");
//     let currentTime = startTime;

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     // Start animation - increment by 1 minute every second
//     const timeInterval = setInterval(() => {
//         currentTime += 60; // 1 minute increment

//         // Log to verify the increment (you can remove this after testing)
//         console.log('Current time:', formatTime(currentTime));


//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);

//         if (currentTime >= endTime) {
//             clearInterval(timeInterval);
//             console.log('Animation complete');
//         }
//     }, 1000); // Update every second

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
// });




// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35;
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Create timer display
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     // Create play/pause button
//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     // Create time slider
//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 60)  // 1-minute steps
//         .attr("value", startTime)
//         .style("width", "100%");

//     // Create speed control
//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500 },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.01);

//     // Add category labels
//     svg.selectAll(".category-label")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("text")
//         .attr("class", "category-label")
//         .attr("x", category => categoryPositions[category].x)
//         .attr("y", category => categoryPositions[category].y - 80)
//         .attr("text-anchor", "middle")
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Create simulation
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-5))
//         .force("collide", d3.forceCollide().radius(6).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         timeInterval = setInterval(() => {
//             currentTime += 60;
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
//         }, speed);
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });





// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Previous code remains the same until category labels...
    
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35;
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Previous time control code remains the same...
    
//     // Create timer display
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     // Create play/pause button
//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     // Create time slider
//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("08:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 60)  // 1-minute steps
//         .attr("value", startTime)
//         .style("width", "100%");

//     // Create speed control with 2x as default
//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.01);

//     // Add category labels with percentage containers
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - 80})`);

//     // Add category name
//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Add percentage text
//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-5))
//         .force("collide", d3.forceCollide().radius(6).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     // Function to update category percentages
//     function updateCategoryPercentages() {
//         const totalNodes = nodes.length;
//         const categoryCounts = {};
        
//         // Initialize counts
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         // Count nodes in each category
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//             }
//         });
        
//         // Update percentage displays
//         svg.selectAll(".category-percentage")
//             .text(d => {
//                 const percentage = (categoryCounts[d] / totalNodes * 100).toFixed(1);
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
        
//         // Update percentages after positions are updated
//         updateCategoryPercentages();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         timeInterval = setInterval(() => {
//             currentTime += 60;
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
//         }, speed);
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .text(d => d)
//         .style("font-size", "12px");

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });



// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35;
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Create timer display
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     // Create play/pause button
//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     // Create time slider
//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 60)  // 1-minute steps
//         .attr("value", startTime)
//         .style("width", "100%");

//     // Create speed control with 2x as default
//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 60)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.01);

//     // Add category labels with percentage containers
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - 80})`);

//     // Add category name
//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Add percentage text
//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-5))
//         .force("collide", d3.forceCollide().radius(6).strength(0.9))
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;


//     // Add legend with percentages
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     // Add percentage text to legend (now first)
//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)  // Start at the beginning
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")  // Align right
//         .attr("dx", "30")  // Add some padding before the color box
//         .text("0%");

//     // Add color rectangle (now second)
//     legendItems.append("rect")
//         .attr("x", 40)  // Position after percentage
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     // Add category name (now third)
//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)  // Position after color rectangle
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Update the updateCategoryPercentages function

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         // Initialize counts
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         // Count nodes in each category and total active nodes
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++; // Count only nodes that have an active category
//             }
//         });
        
//         // Update percentage displays in both circle labels and legend
//         svg.selectAll(".category-percentage")
//             .text(d => {
//                 // Calculate percentage based on active nodes instead of total nodes
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });

//         // Update legend percentages
//         svg.selectAll(".legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }



//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation.force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
        
//         // Update percentages after positions are updated
//         updateCategoryPercentages();
//     }

//     // Update simulation
//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         timeInterval = setInterval(() => {
//             currentTime += 60;
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
//         }, speed);
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     // Add mouseover interactions
//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });







// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions in a circle with increased spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.4; // Increased from 0.35 to 0.4
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // [Time control elements remain the same...]
//     // Create timer display
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 60)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add larger category regions
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", 120) // Doubled from 60 to 120
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.2); // Increased from 0.01 to 0.2 for better visibility

//     // Add category labels with adjusted positioning
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - 140})`); // Adjusted from -80 to -140

//     // Add category name
//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     // Add percentage text
//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-10)) // Increased repulsion
//         .force("collide", d3.forceCollide().radius(8).strength(0.9)) // Increased collision radius
//         .force("x", d3.forceX().strength(0.7))
//         .force("y", d3.forceY().strength(0.7));

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 6, // Slightly larger nodes
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // [Rest of the code remains the same...]
//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     // Functions
//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });
        
//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         simulation
//             .force("x", d3.forceX(d => d.targetX))
//             .force("y", d3.forceY(d => d.targetY));
        
//         simulation.alpha(0.3).restart();
//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         timeInterval = setInterval(() => {
//             currentTime += 60;
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
//         }, speed);
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });







// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions remain the same
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions with MUCH larger spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.3; // Decreased to bring categories closer to center
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Time control elements (timer, play button, slider, speed control)
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 300)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add much smaller category regions
//     const regionRadius = 80; // Decreased region radius
    
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", regionRadius)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.0);

//     // Add category labels with adjusted positioning
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-30)) // Increased repulsion
//         .force("collide", d3.forceCollide().radius(10).strength(1))
//         .force("x", d3.forceX().strength(0.95)) // Significantly increased x-force
//         .force("y", d3.forceY().strength(0.95)) // Significantly increased y-force
//         .velocityDecay(0.3); // Reduced from default 0.4 to maintain momentum

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });
        
//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 // Add immediate position update for faster initial movement
//                 node.vx = (categoryPositions[currentActivity.category].x - node.x) * 0.2;
//                 node.vy = (categoryPositions[currentActivity.category].y - node.y) * 0.2;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });
    
//         bubbles.style("fill", d => colorScale(d.category || "none"));
    
//         // Increase alpha (simulation heat) for more energetic movement
//         simulation
//             .force("x", d3.forceX(d => d.targetX).strength(0.95))
//             .force("y", d3.forceY(d => d.targetY).strength(0.95))
//             .alpha(0.8) // Increased from 0.3
//             .restart();
        
//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }
    
//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         function animate() {
//             currentTime += 600;  // 10 minute increment
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
            
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
    
//             // Add 4-second delay between updates
//             setTimeout(() => {
//                 if (isPlaying) {
//                     requestAnimationFrame(animate);
//                 }
//             }, 4000); // 4000ms = 4 seconds delay
//         }
        
//         if (isPlaying) {
//             animate();
//         }
//     }
    
//     // Modified time slider event handler to maintain consistency
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
        
//         // Add small delay before position update for smooth transition
//         setTimeout(() => {
//             updatePositions(currentTime);
//         }, 100);
//     });

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });





// // Configuration
// const width = 1200;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions with increased spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.35; // Increased radius for more spread
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Time control elements
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 300)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Increase category region size
//     const regionRadius = 120; // Increased for more space
    
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", regionRadius)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create nodes with increased size
//    // Create nodes with slightly reduced size
//    const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 5, // Reduced from 6 to 5
//         category: null
//     }));

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-30)) // Reduced repulsion force
//         .force("collide", d3.forceCollide().radius(7).strength(0.5)) // Reduced collision radius
//         .force("x", d3.forceX().strength(0.8)) // Increased strength for tighter clustering
//         .force("y", d3.forceY().strength(0.8)) // Increased strength for tighter clustering
//         .velocityDecay(0.3); // Reduced for more responsive movement

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });
        
//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 // Reduced spread factor for tighter grouping
//                 const spreadFactor = 0.6; // Reduced from 0.8
//                 const angle = Math.random() * 2 * Math.PI;
//                 const spread = Math.random() * regionRadius * spreadFactor;
                
//                 node.targetX = categoryPositions[currentActivity.category].x + Math.cos(angle) * spread;
//                 node.targetY = categoryPositions[currentActivity.category].y + Math.sin(angle) * spread;
                
//                 // Increased movement speed for faster grouping
//                 node.vx = (node.targetX - node.x) * 0.15;
//                 node.vy = (node.targetY - node.y) * 0.15;
//             }
//         });
    
//         bubbles.style("fill", d => colorScale(d.category || "none"));
    
//         simulation
//             .force("x", d3.forceX(d => d.targetX).strength(0.8))
//             .force("y", d3.forceY(d => d.targetY).strength(0.8))
//             .alpha(0.4)
//             .restart();
        
//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
        
//         function animate() {
//             currentTime += 600;  // 10 minute increment
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
            
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);

//             // Add 4-second delay between updates
//             setTimeout(() => {
//                 if (isPlaying) {
//                     requestAnimationFrame(animate);
//                 }
//             }, 4000); // 4000ms = 4 seconds delay
//         }
        
//         if (isPlaying) {
//             animate();
//         }
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         setTimeout(() => {
//             updatePositions(currentTime);
//         }, 100);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });




// // Configuration with reduced dimensions
// const width = 900;
// const height = 600;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions with reduced spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.28;
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Time control elements
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 300)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG with new dimensions
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Reduce category region size
//     const regionRadius = 90;
    
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", regionRadius)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create nodes with reduced size
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 4,
//         category: null
//     }));

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-25))
//         .force("collide", d3.forceCollide().radius(6).strength(0.5))
//         .force("x", d3.forceX().strength(0.8))
//         .force("y", d3.forceY().strength(0.8))
//         .velocityDecay(0.3);

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 200}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });
        
//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 const spreadFactor = 0.5;
//                 const angle = Math.random() * 2 * Math.PI;
//                 const spread = Math.random() * regionRadius * spreadFactor;
                
//                 node.targetX = categoryPositions[currentActivity.category].x + Math.cos(angle) * spread;
//                 node.targetY = categoryPositions[currentActivity.category].y + Math.sin(angle) * spread;
                
//                 node.vx = (node.targetX - node.x) * 0.15;
//                 node.vy = (node.targetY - node.y) * 0.15;
//             }
//         });
    
//         bubbles.style("fill", d => colorScale(d.category || "none"));
    
//         simulation
//             .force("x", d3.forceX(d => d.targetX).strength(0.8))
//             .force("y", d3.forceY(d => d.targetY).strength(0.8))
//             .alpha(0.4)
//             .restart();
        
//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
        
//         function animate() {
//             currentTime += 600;  // 10 minute increment
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
            
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);

//             // Add 4-second delay between updates
//             setTimeout(() => {
//                 if (isPlaying) {
//                     requestAnimationFrame(animate);
//                 }
//             }, 4000);
//         }
        
//         if (isPlaying) {
//             animate();
//         }
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         setTimeout(() => {
//             updatePositions(currentTime);
//         }, 100);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });






// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions remain the same
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);
    
//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);
            
//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }
            
//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions with MUCH larger spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.3; // Decreased to bring categories closer to center
//     const angleStep = (2 * Math.PI) / categories.length;
    
//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });
    
//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Time control elements (timer, play button, slider, speed control)
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 300)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add much smaller category regions
//     const regionRadius = 80; // Decreased region radius
    
//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", regionRadius)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels with adjusted positioning
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category => 
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-30)) // Increased repulsion
//         .force("collide", d3.forceCollide().radius(10).strength(1))
//         .force("x", d3.forceX().strength(0.95)) // Significantly increased x-force
//         .force("y", d3.forceY().strength(0.95)) // Significantly increased y-force
//         .velocityDecay(0.3); // Reduced from default 0.4 to maintain momentum

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 3,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;
        
//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });
        
//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });
        
//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ? 
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) : 
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a => 
//                 time >= a.startTime && time <= a.endTime
//             );
            
//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 // Add immediate position update for faster initial movement
//                 node.vx = (categoryPositions[currentActivity.category].x - node.x) * 0.2;
//                 node.vy = (categoryPositions[currentActivity.category].y - node.y) * 0.2;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });
    
//         bubbles.style("fill", d => colorScale(d.category || "none"));
    
//         // Increase alpha (simulation heat) for more energetic movement
//         simulation
//             .force("x", d3.forceX(d => d.targetX).strength(0.95))
//             .force("y", d3.forceY(d => d.targetY).strength(0.95))
//             .alpha(0.8) // Increased from 0.3
//             .restart();
        
//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }
    
//     // [Previous code remains the same until the startAnimation function]

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
    
//         function animate() {
//             currentTime += 300; // 5-minute increment (adjust as needed)
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
    
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
    
//             // Add a 4-second delay before the next update
//             setTimeout(() => {
//                 if (isPlaying) {
//                     animate();
//                 }
//             }, 4000); // 4-second delay
//         }
    
//         if (isPlaying) {
//             animate();
//         }
//     }

//     // Modified time slider event handler to include delay
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
        
//         // Add delay before position update
//         setTimeout(() => {
//             updatePositions(currentTime);
//         }, 100); // Small delay for slider updates
//     });

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;
        
//         timeInterval = setInterval(() => {
//             currentTime += 300;
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }
//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);
//         }, speed);
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);
    
//     timeSlider.on("input", function() {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function() {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", () => {
//         tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });







// // Configuration
// const width = 1400;
// const height = 800;
// const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// // Time parsing and formatting functions
// const parseTime = timeStr => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 3600 + minutes * 60;
// };

// const formatTime = seconds => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Load and process data
// d3.csv("employee_activities.csv").then(data => {
//     // Process employee activities
//     const employeeActivities = d3.group(data, d => d.EmployeeID);

//     // Create timeline data structure
//     const timelineData = new Map();
//     employeeActivities.forEach((activities, employeeId) => {
//         activities.forEach(activity => {
//             const startSeconds = parseTime(activity.StartTime);
//             const endSeconds = parseTime(activity.EndTime);

//             if (!timelineData.has(employeeId)) {
//                 timelineData.set(employeeId, []);
//             }

//             timelineData.get(employeeId).push({
//                 startTime: startSeconds,
//                 endTime: endSeconds,
//                 category: activity.TaskCategory,
//                 duration: +activity.Duration_Hours
//             });
//         });
//     });

//     // Get unique categories
//     let categories = [...new Set(data.map(d => d.TaskCategory))];
//     categories = categories.filter(cat => cat !== 'Misc');
//     const centerCategory = 'Misc';

//     // Create category positions with MUCH larger spacing
//     const categoryPositions = {};
//     const radius = Math.min(width, height) * 0.3; // Decreased to bring categories closer to center
//     const angleStep = (2 * Math.PI) / categories.length;

//     categories.forEach((category, i) => {
//         const angle = i * angleStep - Math.PI / 2;
//         categoryPositions[category] = {
//             x: width / 2 + radius * Math.cos(angle),
//             y: height / 2 + radius * Math.sin(angle)
//         };
//     });

//     categoryPositions[centerCategory] = {
//         x: width / 2,
//         y: height / 2
//     };

//     // Create time control container
//     const timeControl = d3.select("body")
//         .insert("div", ":first-child")
//         .attr("class", "time-control")
//         .style("margin", "20px")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("gap", "10px");

//     // Time control elements (timer, play button, slider, speed control)
//     const timerDisplay = timeControl
//         .append("div")
//         .attr("class", "timer")
//         .style("font-size", "18px")
//         .style("font-weight", "bold");

//     const playButton = timeControl
//         .append("button")
//         .text("Play/Pause")
//         .style("padding", "5px 10px");

//     const sliderContainer = timeControl
//         .append("div")
//         .style("flex-grow", "1")
//         .style("margin", "0 20px");

//     const startTime = parseTime("11:00");
//     const endTime = parseTime("23:55");

//     const timeSlider = sliderContainer
//         .append("input")
//         .attr("type", "range")
//         .attr("min", startTime)
//         .attr("max", endTime)
//         .attr("step", 300)
//         .attr("value", startTime)
//         .style("width", "100%");

//     const speedControl = timeControl
//         .append("select")
//         .style("padding", "5px");

//     const speedOptions = [
//         { label: "0.5x", value: 2000 },
//         { label: "1x", value: 1000 },
//         { label: "2x", value: 500, default: true },
//         { label: "5x", value: 200 }
//     ];

//     speedControl
//         .selectAll("option")
//         .data(speedOptions)
//         .enter()
//         .append("option")
//         .attr("value", d => d.value)
//         .attr("selected", d => d.default ? "" : null)
//         .text(d => d.label);

//     // Create SVG
//     const svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // Add much smaller category regions
//     const regionRadius = 80; // Decreased region radius

//     svg.selectAll(".category-region")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("circle")
//         .attr("class", "category-region")
//         .attr("cx", category => categoryPositions[category].x)
//         .attr("cy", category => categoryPositions[category].y)
//         .attr("r", regionRadius)
//         .style("fill", "none")
//         .style("stroke", d => colorScale(d))
//         .style("stroke-width", 2)
//         .style("opacity", 0.3);

//     // Add category labels with adjusted positioning
//     const categoryGroups = svg.selectAll(".category-group")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "category-group")
//         .attr("transform", category =>
//             `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

//     categoryGroups.append("text")
//         .attr("class", "category-label")
//         .attr("text-anchor", "middle")
//         .attr("y", -10)
//         .style("font-size", "14px")
//         .style("font-weight", "bold")
//         .text(d => d);

//     categoryGroups.append("text")
//         .attr("class", "category-percentage")
//         .attr("text-anchor", "middle")
//         .attr("y", 10)
//         .style("font-size", "12px")
//         .text("0%");

//     // Create simulation with adjusted forces
//     const simulation = d3.forceSimulation()
//         .force("charge", d3.forceManyBody().strength(-30)) // Increased repulsion
//         .force("collide", d3.forceCollide().radius(10).strength(1))
//         .force("x", d3.forceX().strength(0.95)) // Significantly increased x-force
//         .force("y", d3.forceY().strength(0.95)) // Significantly increased y-force
//         .velocityDecay(0.3); // Reduced from default 0.4 to maintain momentum

//     // Create nodes
//     const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
//         id: employeeId,
//         radius: 3,
//         category: null
//     }));

//     // Create bubbles
//     const bubbles = svg.selectAll(".bubble")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "bubble")
//         .attr("r", d => d.radius)
//         .style("fill-opacity", 0.8)
//         .style("stroke", "#fff")
//         .style("stroke-width", 0.5);

//     // Add legend
//     const legend = svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", `translate(${width - 250}, 20)`);

//     const legendItems = legend.selectAll(".legend-item")
//         .data([...categories, centerCategory])
//         .enter()
//         .append("g")
//         .attr("class", "legend-item")
//         .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     legendItems.append("text")
//         .attr("class", "legend-percentage")
//         .attr("x", 0)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .style("font-weight", "bold")
//         .style("text-anchor", "end")
//         .attr("dx", "30")
//         .text("0%");

//     legendItems.append("rect")
//         .attr("x", 40)
//         .attr("width", 15)
//         .attr("height", 15)
//         .style("fill", d => colorScale(d));

//     legendItems.append("text")
//         .attr("class", "legend-label")
//         .attr("x", 65)
//         .attr("y", 12)
//         .style("font-size", "12px")
//         .text(d => d);

//     // Add tooltip
//     const tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0)
//         .style("position", "absolute")
//         .style("background-color", "white")
//         .style("padding", "5px")
//         .style("border", "1px solid #ddd")
//         .style("border-radius", "3px");

//     let currentTime = startTime;
//     let isPlaying = false;
//     let timeInterval;

//     function updateCategoryPercentages() {
//         const categoryCounts = {};
//         let activeNodes = 0;

//         [...categories, centerCategory].forEach(cat => {
//             categoryCounts[cat] = 0;
//         });

//         nodes.forEach(node => {
//             if (node.category) {
//                 categoryCounts[node.category]++;
//                 activeNodes++;
//             }
//         });

//         svg.selectAll(".category-percentage, .legend-percentage")
//             .text(d => {
//                 const percentage = activeNodes > 0 ?
//                     (categoryCounts[d] / activeNodes * 100).toFixed(1) :
//                     '0.0';
//                 return `${percentage}%`;
//             });
//     }

//     function updatePositions(time) {
//         nodes.forEach(node => {
//             const activities = timelineData.get(node.id);
//             const currentActivity = activities.find(a =>
//                 time >= a.startTime && time <= a.endTime
//             );

//             if (currentActivity) {
//                 node.category = currentActivity.category;
//                 // Add immediate position update for faster initial movement
//                 node.vx = (categoryPositions[currentActivity.category].x - node.x) * 0.2;
//                 node.vy = (categoryPositions[currentActivity.category].y - node.y) * 0.2;
//                 node.targetX = categoryPositions[currentActivity.category].x;
//                 node.targetY = categoryPositions[currentActivity.category].y;
//             }
//         });

//         bubbles.style("fill", d => colorScale(d.category || "none"));

//         // Increase alpha (simulation heat) for more energetic movement
//         simulation
//             .force("x", d3.forceX(d => d.targetX).strength(0.95))
//             .force("y", d3.forceY(d => d.targetY).strength(0.95))
//             .alpha(0.8) // Increased from 0.3
//             .restart();

//         updateCategoryPercentages();
//     }

//     simulation.nodes(nodes).on("tick", () => {
//         bubbles
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });

//     function togglePlayPause() {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             startAnimation();
//         } else {
//             clearInterval(timeInterval);
//         }
//     }

//     function startAnimation() {
//         clearInterval(timeInterval);
//         const speed = +speedControl.node().value;

//         function animate() {
//             currentTime += 300; // 5-minute increment (adjust as needed)
//             if (currentTime >= endTime) {
//                 currentTime = startTime;
//             }

//             timeSlider.node().value = currentTime;
//             timerDisplay.text(formatTime(currentTime));
//             updatePositions(currentTime);

//             // Add a 4-second delay before the next update
//             setTimeout(() => {
//                 if (isPlaying) {
//                     animate();
//                 }
//             }, 4000); // 4-second delay
//         }

//         if (isPlaying) {
//             animate();
//         }
//     }

//     // Event listeners
//     playButton.on("click", togglePlayPause);

//     timeSlider.on("input", function () {
//         currentTime = +this.value;
//         timerDisplay.text(formatTime(currentTime));
//         updatePositions(currentTime);
//     });

//     speedControl.on("change", function () {
//         if (isPlaying) {
//             startAnimation();
//         }
//     });

//     bubbles.on("mouseover", (event, d) => {
//         tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
//         tooltip.html(`
//             Employee: ${d.id}<br>
//             Category: ${d.category || "None"}<br>
//             Time: ${formatTime(currentTime)}
//         `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//         .on("mouseout", () => {
//             tooltip.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });

//     // Initialize display
//     timerDisplay.text(formatTime(currentTime));
//     updatePositions(currentTime);
// });


// Configuration
const width = 1400;
const height = 800;
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Time parsing and formatting functions
const parseTime = timeStr => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60;
};

const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Load and process data
d3.csv("employee_activities.csv").then(data => {
    // Process employee activities
    const employeeActivities = d3.group(data, d => d.EmployeeID);

    // Create timeline data structure
    const timelineData = new Map();
    employeeActivities.forEach((activities, employeeId) => {
        activities.forEach(activity => {
            const startSeconds = parseTime(activity.StartTime);
            const endSeconds = parseTime(activity.EndTime);

            if (!timelineData.has(employeeId)) {
                timelineData.set(employeeId, []);
            }

            timelineData.get(employeeId).push({
                startTime: startSeconds,
                endTime: endSeconds,
                category: activity.TaskCategory,
                duration: +activity.Duration_Hours
            });
        });
    });

    // Get unique categories
    let categories = [...new Set(data.map(d => d.TaskCategory))];
    categories = categories.filter(cat => cat !== 'Misc');
    const centerCategory = 'Misc';

    // Create category positions with MUCH larger spacing
    const categoryPositions = {};
    const radius = Math.min(width, height) * 0.3;
    const angleStep = (2 * Math.PI) / categories.length;

    categories.forEach((category, i) => {
        const angle = i * angleStep - Math.PI / 2;
        categoryPositions[category] = {
            x: width / 2 + radius * Math.cos(angle),
            y: height / 2 + radius * Math.sin(angle)
        };
    });

    categoryPositions[centerCategory] = {
        x: width / 2,
        y: height / 2
    };

    // Create time control container with adjusted layout
    const timeControl = d3.select("body")
        .insert("div", ":first-child")
        .attr("class", "time-control")
        .style("margin", "20px")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("gap", "10px");

    // Timer display in its own row
    const timerDisplay = timeControl
        .append("div")
        .attr("class", "timer")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-top", "50px")  // Added 1 inch (96px) top margin
        .style("margin-bottom", "10px");

    // Controls container for play button, slider, and speed control
    const controlsContainer = timeControl
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "10px");

    const playButton = controlsContainer
        .append("button")
        .text("Play/Pause")
        .style("padding", "5px 10px");

    const sliderContainer = controlsContainer
        .append("div")
        .style("flex-grow", "1")
        .style("margin", "0 20px");

    const startTime = parseTime("11:00");
    const endTime = parseTime("23:55");

    const timeSlider = sliderContainer
        .append("input")
        .attr("type", "range")
        .attr("min", startTime)
        .attr("max", endTime)
        .attr("step", 300)
        .attr("value", startTime)
        .style("width", "100%");

    const speedControl = controlsContainer
        .append("select")
        .style("padding", "5px");

    const speedOptions = [
        { label: "0.5x", value: 2000 },
        { label: "1x", value: 1000 },
        { label: "2x", value: 500, default: true },
        { label: "5x", value: 200 }
    ];

    speedControl
        .selectAll("option")
        .data(speedOptions)
        .enter()
        .append("option")
        .attr("value", d => d.value)
        .attr("selected", d => d.default ? "" : null)
        .text(d => d.label);

    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add much smaller category regions
    const regionRadius = 80;

    svg.selectAll(".category-region")
        .data([...categories, centerCategory])
        .enter()
        .append("circle")
        .attr("class", "category-region")
        .attr("cx", category => categoryPositions[category].x)
        .attr("cy", category => categoryPositions[category].y)
        .attr("r", regionRadius)
        .style("fill", "none")
        .style("stroke", d => colorScale(d))
        .style("stroke-width", 2)
        .style("opacity", 0.0);

    // Add category labels with adjusted positioning
    const categoryGroups = svg.selectAll(".category-group")
        .data([...categories, centerCategory])
        .enter()
        .append("g")
        .attr("class", "category-group")
        .attr("transform", category =>
            `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 30})`);

    categoryGroups.append("text")
        .attr("class", "category-label")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(d => d);

    categoryGroups.append("text")
        .attr("class", "category-percentage")
        .attr("text-anchor", "middle")
        .attr("y", 10)
        .style("font-size", "12px")
        .text("0%");

    // Create simulation with adjusted forces
    const simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collide", d3.forceCollide().radius(10).strength(1))
        .force("x", d3.forceX().strength(0.95))
        .force("y", d3.forceY().strength(0.95))
        .velocityDecay(0.3);

    // Create nodes
    const nodes = Array.from(employeeActivities.keys()).map(employeeId => ({
        id: employeeId,
        radius: 3,
        category: null
    }));

    // Create bubbles
    const bubbles = svg.selectAll(".bubble")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => d.radius)
        .style("fill-opacity", 0.8)
        .style("stroke", "#fff")
        .style("stroke-width", 0.5);

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 250}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
        .data([...categories, centerCategory])
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("text")
        .attr("class", "legend-percentage")
        .attr("x", 0)
        .attr("y", 12)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("text-anchor", "end")
        .attr("dx", "30")
        .text("0%");

    legendItems.append("rect")
        .attr("x", 40)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => colorScale(d));

    legendItems.append("text")
        .attr("class", "legend-label")
        .attr("x", 65)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d => d);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "3px");

    let currentTime = startTime;
    let isPlaying = false;
    let timeInterval;

    function updateCategoryPercentages() {
        const categoryCounts = {};
        let activeNodes = 0;

        [...categories, centerCategory].forEach(cat => {
            categoryCounts[cat] = 0;
        });

        nodes.forEach(node => {
            if (node.category) {
                categoryCounts[node.category]++;
                activeNodes++;
            }
        });

        svg.selectAll(".category-percentage, .legend-percentage")
            .text(d => {
                const percentage = activeNodes > 0 ?
                    (categoryCounts[d] / activeNodes * 100).toFixed(1) :
                    '0.0';
                return `${percentage}%`;
            });
    }

    function updatePositions(time) {
        nodes.forEach(node => {
            const activities = timelineData.get(node.id);
            const currentActivity = activities.find(a =>
                time >= a.startTime && time <= a.endTime
            );

            if (currentActivity) {
                node.category = currentActivity.category;
                node.vx = (categoryPositions[currentActivity.category].x - node.x) * 0.2;
                node.vy = (categoryPositions[currentActivity.category].y - node.y) * 0.2;
                node.targetX = categoryPositions[currentActivity.category].x;
                node.targetY = categoryPositions[currentActivity.category].y;
            }
        });

        bubbles.style("fill", d => colorScale(d.category || "none"));

        simulation
            .force("x", d3.forceX(d => d.targetX).strength(0.95))
            .force("y", d3.forceY(d => d.targetY).strength(0.95))
            .alpha(0.8)
            .restart();

        updateCategoryPercentages();
    }

    simulation.nodes(nodes).on("tick", () => {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startAnimation();
        } else {
            clearInterval(timeInterval);
        }
    }

    function startAnimation() {
        clearInterval(timeInterval);
        const speed = +speedControl.node().value;

        function animate() {
            currentTime += 300;
            if (currentTime >= endTime) {
                currentTime = startTime;
            }

            timeSlider.node().value = currentTime;
            timerDisplay.text(formatTime(currentTime));
            updatePositions(currentTime);

            setTimeout(() => {
                if (isPlaying) {
                    animate();
                }
            }, 4000);
        }

        if (isPlaying) {
            animate();
        }
    }

    // Event listeners
    playButton.on("click", togglePlayPause);

    timeSlider.on("input", function() {
        currentTime = +this.value;
        timerDisplay.text(formatTime(currentTime));
        updatePositions(currentTime);
    });

    speedControl.on("change", function() {
        if (isPlaying) {
            startAnimation();
        }
    });

    bubbles.on("mouseover", (event, d) => {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip.html(`
            Employee: ${d.id}<br>
            Category: ${d.category || "None"}<br>
            Time: ${formatTime(currentTime)}
        `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    // Initialize display
    timerDisplay.text(formatTime(currentTime));
    updatePositions(currentTime);
});