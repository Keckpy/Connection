import { createClient } from '@supabase/supabase-js';
import './style.css';
import Handlebars from 'handlebars';
import dataTableTemplateSource from './templates/dataTable.hbs?raw';

const dataTableTemplate = Handlebars.compile(dataTableTemplateSource);

// 1. Maintain formatting helper execution block
Handlebars.registerHelper('formatDate', function(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
});

// 2. Client Credentials Layer Configuration (Make sure to paste your real keys here!)
const SUPABASE_URL = "https://wkjffzojirabmmyupqnc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U09_Lbeq10Bpfx4bm81TSA_lSe68d95";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. Document Reference Elements Mapping
const actionButton = document.getElementById('add-btn');
const tableContainer = document.getElementById('table-container');
const modalContainer = document.getElementById('modal-container');

// 4. Component Layout Engine Templates String Mapping
const modalTemplateSource = `
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Add New Record</h3>
            <input type="text" id="item-input" class="modal-input" placeholder="Enter item name..." autofocus />
            <div class="modal-actions">
                <button id="modal-submit-btn">Save to DB</button>
                <button id="modal-close-btn" class="btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
`;
const modalTemplate = Handlebars.compile(modalTemplateSource);

// ... (Keep lines 1 through 50 with imports, variables, config, and modal settings exactly the same) ...

// 5. Database Data Query Fetch Process Pipeline
async function fetchAndRenderTable() {
    tableContainer.innerText = "Syncing table ledger contents...";
    
    let { data, error } = await supabaseClient
        .from('Items')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tableContainer.innerText = "Error syncing: " + error.message;
        return;
    }

    if (data && data.length > 0) {
        tableContainer.innerHTML = dataTableTemplate({ itemsList: data });
        
        // Transform the state of our structural layout toggle buttons triggers array mapping 
        actionButton.innerText = "Add Item";
        actionButton.removeEventListener('click', fetchAndRenderTable);
        actionButton.addEventListener('click', openModal);

        // 🌟 NEW FUNCTIONALITY HAPPENS HERE: Wire up the spawned delete buttons
        // Gather all generated action button elements nodes inside our freshly output grid layout matrix
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', deleteRowItem);
        });

    } else {
        tableContainer.innerText = "No data listings present.";
    }
}

// 🌟 NEW FUNCTIONALITY HAPPENS HERE: The Delete Action Handler
async function deleteRowItem(event) {
    // Target the specific row id hidden in the data-id attribute of the clicked button
    const targetId = event.target.getAttribute('data-id');
    
    // Quick validation prompt confirmation checkpoint to safe guard clicks
    if (!confirm("Are you sure you want to permanently delete this item?")) {
        return;
    }

    event.target.innerText = "Deleting...";
    event.target.disabled = true;

    // Direct Database Table DELETE Query Interface
    const { error } = await supabaseClient
        .from('Items')
        .delete()
        .eq('id', targetId); // Target exactly the matching row ID entry

    if (error) {
        alert("Deletion transaction failure: " + error.message);
        event.target.innerText = "Delete";
        event.target.disabled = false;
        return;
    }

    // Refresh layout view dynamically to pull clean lists 
    fetchAndRenderTable();
}

// ... (Keep the rest of your openModal, closeModal, submitNewItem, and initial state handlers exactly the same) ...


// 6. Modal Lifecycle Control Methods Management Layer
function openModal() {
    modalContainer.innerHTML = modalTemplate();
    modalContainer.classList.remove('hidden');

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-submit-btn').addEventListener('click', submitNewItem);
    
    document.getElementById('item-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitNewItem();
    });
}

function closeModal() {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = ""; 
}

// 7. DB Insert Execution Handler
async function submitNewItem() {
    const inputField = document.getElementById('item-input');
    const newItemValue = inputField.value.trim();

    if (!newItemValue) {
        alert("Please enter a valid item name.");
        return;
    }

    const submitBtn = document.getElementById('modal-submit-btn');
    submitBtn.innerText = "Saving...";
    submitBtn.disabled = true;

    const { error } = await supabaseClient
        .from('Items')
        .insert([{ name: newItemValue }]);

    if (error) {
        alert("Insertion error: " + error.message);
        submitBtn.innerText = "Save to DB";
        submitBtn.disabled = false;
        return;
    }

    closeModal();
    fetchAndRenderTable(); // Refresh the table list to show the new item immediately
}

// 8. Initial App State Triggers
// The webpage loads up with the button labeled "Grab Data" and wired to fetch your database rows
actionButton.innerText = "Grab Data";
actionButton.addEventListener('click', fetchAndRenderTable);
