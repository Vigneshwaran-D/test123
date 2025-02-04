// Configuration
// At the start of your code
d3.select("body")
    .style("margin", "0")
    .style("padding", "0")
    .style("overflow", "hidden");

// Update width and height to be dynamic
const width = window.innerWidth;
const height = window.innerHeight;

// const width = 1600;
// const height = 1200;
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Time parsing and formatting functions
const parseTime = timeStr => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60;
};

const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    // return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Load and process data
d3.csv("employee_activities.csv").then(data => {
    // Set the background color of the body and text color
    d3.select("body")
        .style("background-color", "black")
        .style("color", "white");

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
    const radius = Math.min(width, height) * 0.26;
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

    // Create time control container with adjusted layout and dark theme
    const timeControl = d3.select("body")
        .insert("div", ":first-child")
        .attr("class", "time-control")
        .style("position", "fixed")
        .style("top", "20px")
        .style("left", "20px")
        .style("right", "20px")
        .style("z-index", "1000");
        // .style("margin-top", "420px")
        // .style("margin-bottom", "420px")
        // .style("margin", "20px")
        // .style("display", "flex")
        // .style("flex-direction", "column")
        // .style("gap", "10px");

    // Timer display in its own row with white text
    const timerDisplay = timeControl
        .append("div")
        .attr("class", "timer")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .style("text-align", "center")
        .style("margin-top", "50px")
        .style("margin-bottom", "10px")
        .style("color", "white")
        .style("background-color", "black") // Explicitly set background to black
        .style("border", "none"); // Remove any border

    // Controls container for play button, slider, and speed control
    const controlsContainer = timeControl
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "10px");

    const playButton = controlsContainer
        .append("button")
        .text("Play/Pause")
        .style("padding", "5px 10px")
        .style("background-color", "#333")
        .style("color", "white")
        .style("border", "1px solid #555")
        .style("border-radius", "3px");

    const sliderContainer = controlsContainer
        .append("div")
        .style("flex-grow", "1")
        .style("margin", "0 20px");

    const startTime = parseTime("11:00");
    const endTime = parseTime("21:55");

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
        .style("padding", "5px")
        .style("background-color", "#333")
        .style("color", "white")
        .style("border", "1px solid #555");

    const speedOptions = [
        { label: "0.5x", value: 2000 },
        { label: "1x", value: 1000, default: true},
        { label: "2x", value: 500},
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

    // Create SVG with dark background
    const svg = d3.select("#chart")
        .append("svg")
        // .attr("width", width)
        // .attr("height", height)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background-color", "black");

    // Add much smaller category regions
    const regionRadius = 60;

    svg.selectAll(".category-region")
        .data([...categories, centerCategory])
        .enter()
        .append("g")
        .attr("class", "category-region")
        .attr("cx", category => categoryPositions[category].x)
        .attr("cy", category => categoryPositions[category].y)
        .attr("r", regionRadius)
        .style("fill", "none")
        .style("stroke", d => colorScale(d))
        .style("stroke-width", 2)
        .style("opacity", 0.3);

    // Add category labels with adjusted positioning and white text
    // const categoryGroups = svg.selectAll(".category-group")
    //     .data([...categories, centerCategory])
    //     .enter()
    //     .append("g")
    //     .attr("class", "category-group")
    //     .attr("transform", category =>
    //         `translate(${categoryPositions[category].x},${categoryPositions[category].y - regionRadius - 10})`);

    // categoryGroups.append("text")
    //     .attr("class", "category-label")
    //     .attr("text-anchor", "middle")
    //     .attr("y", 0)
    //     .style("font-size", "14px")
    //     .style("font-weight", "bold")
    //     .style("fill", "white")
    //     .text(d => d);

    // categoryGroups.append("text")
    //     .attr("class", "category-percentage")
    //     .attr("text-anchor", "middle")
    //     .attr("y", 10)
    //     .style("font-size", "12px")
    //     .style("fill", "white")
    //     .text("0%");


    const categoryGroups = svg.selectAll(".category-group")
    .data([...categories, centerCategory])
    .enter()
    .append("g")
    .attr("class", "category-group")
    .attr("transform", category => {
        const x = categoryPositions[category].x;
        const y = categoryPositions[category].y;
        
        if (category === centerCategory) {
            // Center category label position (below the circle)
            return `translate(${x}, ${y + regionRadius + 20})`;
        } else {
            // Calculate angle for the current category
            const dx = x - width/2;
            const dy = y - height/2;
            const angle = Math.atan2(dy, dx);
            
            // Position labels further out from the circle
            const labelRadius = regionRadius + 30;
            const labelX = x + Math.cos(angle) * labelRadius;
            const labelY = y + Math.sin(angle) * labelRadius;
            
            return `translate(${labelX}, ${labelY})`;
        }
    });

categoryGroups.append("text")
    .attr("class", "category-label")
    .attr("text-anchor", "middle") 
    // .attr("text-anchor", d => {
    //     if (d === centerCategory) return "middle";
    //     const x = categoryPositions[d].x;
    //     // Determine text alignment based on position relative to center
    //     return x > width/2 ? "start" : "end";
    // })
    .attr("y", 0)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "white")
    .text(d => d);

categoryGroups.append("text")
    .attr("class", "category-percentage")
    .attr("text-anchor", "middle")
    // .attr("text-anchor", d => {
    //     if (d === centerCategory) return "middle";
    //     // const x = categoryPositions[d].x;
    //     // return x > width/2 ? "start" : "end"
    //     return "middle";
    // })
    .attr("y", 20)
    .attr("dx", 0)
    .style("font-size", "12px")
    .style("fill", "white")
    .text("0%");

    // Create simulation with adjusted forces for tighter clustering
    const simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-1))  // Reduced from -30 to -15 for less repulsion
        .force("collide", d3.forceCollide().radius(5).strength(0.8))  // Reduced radius from 10 to 5
        .force("x", d3.forceX().strength(0.4))  // Increased from 0.95 to 0.99 for tighter grouping
        .force("y", d3.forceY().strength(0.4))  // Increased from 0.95 to 0.99 for tighter grouping
        .velocityDecay(0.05)  // Increased from 0.3 to 0.4 for more stable clustering
        .alphaDecay(0.02);

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
        .style("stroke", "#333")
        .style("stroke-width", 0.5);

    // Add legend with white text
    /*
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
        .style("fill", "white")
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
        .style("fill", "white")
        .text(d => d);

    */

    // Add tooltip with dark theme
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "#333")
        .style("color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #555")
        .style("border-radius", "3px");

    // Rest of the code remains the same...
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
                // Reduce movement speed and add gradual transition
                const dx = categoryPositions[currentActivity.category].x - node.x;
                const dy = categoryPositions[currentActivity.category].y - node.y;
                node.vx = dx * 0.1;  // Reduced from 0.2 to 0.1 for smoother movement
                node.vy = dy * 0.1;  // Reduced from 0.2 to 0.1 for smoother movement
                node.targetX = categoryPositions[currentActivity.category].x;
                node.targetY = categoryPositions[currentActivity.category].y;
            }
        });
    
        bubbles.style("fill", d => colorScale(d.category || "none"))
               .style("transition", "fill 0.3s ease-in-out");  // Add color transition
    
        simulation
            .force("x", d3.forceX(d => d.targetX).strength(0.2))
            .force("y", d3.forceY(d => d.targetY).strength(0.2))
            .alpha(0.3)  // Reduced from 0.8 to 0.3 for smoother transitions
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
            currentTime += 1 * 60;
            if (currentTime >= endTime) {
                currentTime = startTime;
            }
    
            timeSlider.node().value = currentTime;
            timerDisplay.text(formatTime(currentTime));
            updatePositions(currentTime);
    
            // Reduced timeout for more frequent updates
            setTimeout(() => {
                if (isPlaying) {
                    animate();
                }
            }, speed);  // Use the speed value directly instead of fixed 4000
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

    // Auto-start animation
    isPlaying = true;  // Set initial state to playing
    startAnimation();  // Start the animation immediately
});