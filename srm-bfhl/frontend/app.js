const { createApp, ref } = Vue;

// Recursive component for rendering the tree
const TreeNode = {
    props: {
        tree: {
            type: Object,
            required: true
        }
    },
    template: document.getElementById('tree-node-template').innerHTML
};

const app = createApp({
    components: {
        TreeNode
    },
    setup() {
        const inputText = ref('A->B\nA->C\nB->D');
        const loading = ref(false);
        const errorMsg = ref('');
        const response = ref(null);

        const analyseData = async () => {
            loading.value = true;
            errorMsg.value = '';
            
            // 1. Process Input
            const lines = inputText.value
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (lines.length === 0) {
                errorMsg.value = 'Please enter at least one edge.';
                loading.value = false;
                return;
            }

            try {
                // 2. API Call
                const res = await fetch('http://localhost:3000/bfhl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: lines })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Server responded with ${res.status}`);
                }

                // 3. Handle Success
                const data = await res.json();
                response.value = data;
                
            } catch (err) {
                console.error('API Error:', err);
                errorMsg.value = err.message || 'Failed to connect to the backend.';
                response.value = null;
            } finally {
                loading.value = false;
            }
        };

        return {
            inputText,
            loading,
            errorMsg,
            response,
            analyseData
        };
    }
});

app.mount('#app');
