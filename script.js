const SUPABASE_URL = "https://wkjffzojirabmmyupqnc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U09_Lbeq10Bpfx4bm81TSA_lSe68d95";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const button = document.getElementById('fetch-btn');
const output = document.getElementById('output');

async function getData() {
    output.innerText = "Loading...";

    let { data, error } = await supabaseClient
        .from('Items')
        .select('*');

    if (error) {
        output.innerText = "Error: " + error.message;
        return;
    }

    if (data  && data.length > 0) {
        output.innerHTML = data.map(item => `<p> ${item.name}</p>`).join('');
    } else {
        output.innerText = "No data found. Did you insert a row yet?";
    }
}

button.addEventListener('click', getData);

