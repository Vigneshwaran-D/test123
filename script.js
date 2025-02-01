// Configuration
const width = 1200;
const height = 800;
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Load and process data
d3.csv("employee_activities.csv").then(data => {
    // Process data - group by employee and calculate total hours
    const employees = d3.rollup(data,
        v => ({
            totalHours: d3.sum(v, d => +d.Duration_Hours),
            tasks: v,
            shiftStart: d3.min(v, d => d.ShiftStart),
            shiftEnd: d3.min(v, d => d.ShiftEnd)
        }),
        d => d.EmployeeID
    );

    const nodes = Array.from(employees, ([id, details]) => ({
        id,
        ...details,
        radius: Math.sqrt(details.totalHours) * 4,
        category: d3.max(details.tasks, d => d.TaskCategory)
    }));

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(5))
        .force("collide", d3.forceCollide().radius(d => d.radius + 2))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05));

    // Create SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create bubbles
    const bubbles = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("r", d => d.radius)
        .style("fill", d => colorScale(d.category));

    // Add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add interaction
    bubbles.on("mouseover", (event, d) => {
            tooltip.transition()
                .style("opacity", 0.9);
            tooltip.html(`Employee: ${d.id}<br>
                        Total Hours: ${d.totalHours.toFixed(2)}<br>
                        Shift: ${d.shiftStart} - ${d.shiftEnd}<br>
                        Main Task: ${d.category}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().style("opacity", 0);
        });

    // Update positions
    simulation.on("tick", () => {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Add periodic movement
    setInterval(() => {
        simulation.force("x", d3.forceX(Math.random() * width).strength(0.05));
        simulation.force("y", d3.forceY(Math.random() * height).strength(0.05));
        simulation.alpha(0.3).restart();
    }, 3000);

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(20,${20 + i * 20})`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d);
});