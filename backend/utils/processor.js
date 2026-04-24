/**
 * Processes the input array of edge strings to build hierarchies and detect cycles.
 * 
 * Rules:
 * 1. Validation: /^([A-Z])->([A-Z])$/ + no self-loops.
 * 2. Duplicates: Only first occurrence is used.
 * 3. Diamond Rule: First parent encountered for a child wins; others discarded.
 * 4. Cycle Detection: Done per connected component of accepted edges.
 * 5. Formatting: Trees are nested objects; cycles have no depth field.
 * 
 * @param {Array} dataArray - Array of strings representing edges (e.g., ["A->B", "B->C"])
 * @returns {Object} { hierarchies, invalid_entries, duplicate_edges, summary }
 */
function processData(dataArray) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const seen_entries = new Set();
    const seen_duplicates = new Set();
    const valid_edges = [];

    // 1 & 2: Validation and Duplicate Detection
    if (Array.isArray(dataArray)) {
        dataArray.forEach(entry => {
            if (typeof entry !== 'string') {
                invalid_entries.push(String(entry));
                return;
            }

            const trimmed = entry.trim();
            if (trimmed === "") {
                invalid_entries.push("");
                return;
            }

            const match = trimmed.match(/^([A-Z])->([A-Z])$/);
            if (!match) {
                invalid_entries.push(trimmed);
                return;
            }

            const [_, parent, child] = match;

            // Self-loop validation: "A->A" is invalid
            if (parent === child) {
                invalid_entries.push(trimmed);
                return;
            }

            // Duplicate detection: Track seen "X->Y" pairs
            if (seen_entries.has(trimmed)) {
                if (!seen_duplicates.has(trimmed)) {
                    duplicate_edges.push(trimmed);
                    seen_duplicates.add(trimmed);
                }
                return;
            }

            seen_entries.add(trimmed);
            valid_edges.push({ parent, child, original: trimmed });
        });
    }

    // 3: Hierarchy building with Diamond Rule
    const adj = {}; // parent -> [children]
    const childToParent = {}; // child -> parent (first one wins)
    const allNodesInValidEdges = new Set();
    const accepted_edges = [];

    valid_edges.forEach(({ parent, child }) => {
        allNodesInValidEdges.add(parent);
        allNodesInValidEdges.add(child);

        // Diamond/multi-parent rule: the first-encountered parent edge wins
        if (childToParent[child] === undefined) {
            childToParent[child] = parent;
            if (!adj[parent]) adj[parent] = [];
            adj[parent].push(child);
            accepted_edges.push({ parent, child });
        }
    });

    // Group nodes into connected components based on ACCEPTED edges (undirected sense)
    const undirectedAdj = {};
    allNodesInValidEdges.forEach(node => undirectedAdj[node] = []);
    accepted_edges.forEach(({ parent, child }) => {
        undirectedAdj[parent].push(child);
        undirectedAdj[child].push(parent);
    });

    const components = [];
    const visitedComp = new Set();
    const sortedAllNodes = Array.from(allNodesInValidEdges).sort();

    sortedAllNodes.forEach(node => {
        if (!visitedComp.has(node)) {
            const componentNodes = [];
            const queue = [node];
            visitedComp.add(node);
            while (queue.length > 0) {
                const u = queue.shift();
                componentNodes.push(u);
                (undirectedAdj[u] || []).forEach(v => {
                    if (!visitedComp.has(v)) {
                        visitedComp.add(v);
                        queue.push(v);
                    }
                });
            }
            components.push(componentNodes);
        }
    });

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let maxDepth = -1;
    let largest_tree_root = null;

    // 4 & 5: Cycle Detection and Tree Building per component
    components.forEach(compNodes => {
        // A root is a node in this component that has no parent in the accepted edges
        const rootsInComp = compNodes.filter(node => childToParent[node] === undefined).sort();
        
        if (rootsInComp.length === 0) {
            // No natural root => Pure Cycle
            // Use lexicographically smallest node as root for the cycle entry
            const root = compNodes.sort()[0];
            hierarchies.push({ root, tree: {}, has_cycle: true });
            total_cycles++;
        } else {
            // One or more roots (In this model, each component has exactly one root 
            // because every other node has exactly one parent)
            const root = rootsInComp[0];

            // Recursive function to build nested object
            const buildNested = (u) => {
                const result = {};
                const children = (adj[u] || []).sort();
                children.forEach(v => {
                    result[v] = buildNested(v);
                });
                return result;
            };

            // Recursive function to calculate depth (longest path node count)
            const getDepth = (u) => {
                const children = adj[u] || [];
                if (children.length === 0) return 1;
                let m = 0;
                children.forEach(v => {
                    m = Math.max(m, getDepth(v));
                });
                return 1 + m;
            };

            const treeStructure = {};
            treeStructure[root] = buildNested(root);
            const depth = getDepth(root);

            hierarchies.push({ root, tree: treeStructure, depth });
            total_trees++;

            // Summary logic
            if (depth > maxDepth) {
                maxDepth = depth;
                largest_tree_root = root;
            } else if (depth === maxDepth) {
                // tiebreak = lexicographically smaller root
                if (largest_tree_root === null || root < largest_tree_root) {
                    largest_tree_root = root;
                }
            }
        }
    });

    // Sort hierarchies by root for consistent output
    hierarchies.sort((a, b) => a.root.localeCompare(b.root));

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processData };
