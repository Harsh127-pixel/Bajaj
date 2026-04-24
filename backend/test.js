const fs = require('fs');

async function runTest() {
    const testData = {
        data: [
            "A->B", "A->C", "B->D", "C->E", "E->F",
            "X->Y", "Y->Z", "Z->X",
            "P->Q", "Q->R",
            "G->H", "G->H", "G->I",
            "hello", "1->2", "A->"
        ]
    };

    console.log('Sending Test Request to http://localhost:3000/bfhl...');
    
    try {
        const response = await fetch('http://localhost:3000/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            console.error(`Request failed with status ${response.status}`);
            return;
        }

        const res = await response.json();
        console.log('\n--- RESPONSE JSON ---');
        console.log(JSON.stringify(res, null, 2));
        console.log('----------------------\n');

        const results = [];

        // 1. Hierarchies has 4 entries
        results.push({
            check: "Hierarchies count is 4",
            passed: res.hierarchies.length === 4
        });

        // 2. X group has has_cycle: true and tree: {}
        const xGroup = res.hierarchies.find(h => h.root === 'X');
        results.push({
            check: "X group has cycle and empty tree",
            passed: xGroup && xGroup.has_cycle === true && Object.keys(xGroup.tree).length === 0
        });

        // 3. Duplicate edges is ["G->H"]
        results.push({
            check: 'Duplicate edges contains ["G->H"]',
            passed: res.duplicate_edges.includes("G->H") && res.duplicate_edges.length === 1
        });

        // 4. invalid_entries contains "hello", "1->2", "A->"
        const expectedInvalids = ["hello", "1->2", "A->"];
        const allInvalidsPresent = expectedInvalids.every(item => res.invalid_entries.includes(item));
        results.push({
            check: 'Invalid entries contains "hello", "1->2", "A->"',
            passed: allInvalidsPresent
        });

        // 5. largest_tree_root is "A"
        results.push({
            check: 'Summary largest_tree_root is "A"',
            passed: res.summary.largest_tree_root === "A"
        });

        // 6. Stats validation
        results.push({
            check: "Total trees is 3 and Total cycles is 1",
            passed: res.summary.total_trees === 3 && res.summary.total_cycles === 1
        });

        // Print final verdict
        console.log('VERIFICATION RESULTS:');
        results.forEach(r => {
            console.log(`${r.passed ? '✅ PASS' : '❌ FAIL'}: ${r.check}`);
        });

    } catch (error) {
        console.error('Test Execution Error:', error.message);
        console.log('TIP: Make sure the server is running on port 3000 (npm start)');
    }
}

runTest();
