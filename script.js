const SUPABASE_URL = "https://wkjffzojirabmmyupqnc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U09_Lbeq10Bpfx4bm81TSA_lSe68d95";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const button = document.getElementById('fetch-btn');
const table = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');

async function getData() {

    let { data, error } = await supabaseClient
        .from('Items')
        .select('*');

    if (data  && data.length > 0) {
        table.classList.remove('hidden-table');

        data.forEach(item => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.innerText = item.id;
            idCell.classList.add('cell-center');
            row.appendChild(idCell);
        })

        const nameCell = document.createElement('td');
        nameCell.innerText = item.name;
        row.appendChild(nameCell);

        const dateCell = document.createElement('td');
        dateCell.innerText = new Date(item.created_at).toLocaleDateString();
        dateCell.classList.add('cell-center', 'cell-date');
        row.appendChild(dateCell);

        tableBody.appendChild(row);
    } else {
        table.classList.add('hidden-table');
        alert("No records found.")
    }
}

button.addEventListener('click', getData);

