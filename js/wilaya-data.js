// Algeria Wilaya and Commune data with delivery pricing

const wilayaData = [
    { 
        id: 1, 
        name: 'Adrar', 
        home: 1100, 
        stopdesk: 600,
        communes: ['Adrar']
    },
    { 
        id: 2, 
        name: 'Chlef', 
        home: 700, 
        stopdesk: 400,
        communes: ['Chlef']
    },
    {
        id: 3, 
        name: 'Laghouat', 
        home: 900, 
        stopdesk: 500,
        communes: ['Laghouat']
    },
    {
        id: 4, 
        name: 'Oum El Bouaghi', 
        home: 700, 
        stopdesk: 500,
        communes: ['Ain Fekroune']
    },
    {
        id: 5, 
        name: 'Batna', 
        home: 600,  
        stopdesk: 400,
        communes: ['Batna']
    },
    {
        id: 6, 
        name: 'Bejaia', 
        home: 600,  
        stopdesk: 400,
        communes: ['Bejaia']
    },
    {
        id: 7, 
        name: 'Biskra', 
        home: 800,  
        stopdesk: 500,
        communes: ['Biskra']
    },
    {
        id: 8, 
        name: 'Bechar', 
        home: 1100,  
        stopdesk: 600,
        communes: ['Bechar']
    },
    {
        id: 9, 
        name: 'Blida', 
        home: 500,  
        stopdesk: 400,
        communes: ['Beni Mered', 'Boufarik', 'Ouled Yaich']
    },
    {
        id: 10, 
        name: 'Bouira', 
        home: 700,  
        stopdesk: 400,
        communes: ['Bouira']
    },
    {
        id: 11, 
        name: 'Tamanrasset', 
        home: 1300,  
        stopdesk: 800,
        communes: ['Tamanrasset']
    },
    {
        id: 12, 
        name: 'Tebessa', 
        home: 800,  
        stopdesk: 400,
        communes: ['Tebessa']
    },
    {
        id: 13, 
        name: 'Tlemcen', 
        home: 800,  
        stopdesk: 400,
        communes: ['Sebdou', 'Tlemcen']
    },
    {
        id: 14, 
        name: 'Tiaret', 
        home: 800,  
        stopdesk: 400,
        communes: ['Ksar Chellala', 'Tiaret']
    },
    {
        id: 15, 
        name: 'Tizi Ouzou', 
        home: 700,  
        stopdesk: 400,
        communes: ['Tizi Ouzou']
    },
    { 
        id: 16, 
        name: 'Alger', 
        home: 500, 
        stopdesk: 350,
        communes: ['Bab El Oued', 'Bab Ezzouar', 'Bir Touta', 'Birkhadem', 'cheraga', 'Reghaia']
    },
    {
        id: 17, 
        name: 'Djelfa', 
        home: 900,  
        stopdesk: 500,
        communes: ['Ain Oussera', 'Djelfa']
    },
    {
        id: 18, 
        name: 'Jijel', 
        home: 600,  
        stopdesk: 400,
        communes: ['Jijel']
    },
        { 
        id: 19, 
        name: 'Sétif', 
        home: 400, 
        stopdesk: 250,
        communes: ['Sétif', 'El Eulma']
    },
    {
        id: 20, 
        name: 'Saida', 
        home: 800,  
        stopdesk: 400,
        communes: ['Saida']
    },
    {
        id: 21, 
        name: 'Skikda', 
        home: 650,  
        stopdesk: 400,
        communes: ['Skikda']
    },
    {
        id: 22, 
        name: 'Sidi Bel Abbes', 
        home: 800,  
        stopdesk: 400,
        communes: ['Sidi Bel Abbes']
    },
    {
        id: 23, 
        name: 'Annaba', 
        home: 700,  
        stopdesk: 400,
        communes: ['Annaba']
    },
    {
        id: 24, 
        name: 'Guelma', 
        home: 700,  
        stopdesk: 400,
        communes: ['Guelma']
    },
    { 
        id: 25, 
        name: 'Constantine', 
        home: 600, 
        stopdesk: 400,
        communes: ['Constantine']
    },
    {
        id: 26, 
        name: 'Medea', 
        home: 700,  
        stopdesk: 400,
        communes: ['Medea']
    },
    {
        id: 27, 
        name: 'Mostaganem', 
        home: 700,  
        stopdesk: 400,
        communes: ['Mostaganem']
    },
    {
        id: 28, 
        name: 'Msila', 
        home: 700,  
        stopdesk: 400,
        communes: ['Msila, Bou Saada']
    },
    {
        id: 29, 
        name: 'Mascara', 
        home: 700,  
        stopdesk: 400,
        communes: ['Mascara']
    },
    {
        id: 30, 
        name: 'Ouargla', 
        home: 1000,  
        stopdesk: 500,
        communes: ['Ouargla']
    },
    { 
        id: 31, 
        name: 'Oran', 
        home: 700, 
        stopdesk: 400,
        communes: ['Oran', 'Bir El Djir']
    },
    {
        id: 32, 
        name: 'El Bayadh', 
        home: 1000,  
        stopdesk: 500,
        communes: ['El Bayadh']
    },
    {
        id: 33, 
        name: 'Illizi', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Illizi']
    },
    {
        id: 34, 
        name: 'Bordj Bou Arreridj', 
        home: 600,  
        stopdesk: 400,
        communes: ['Bordj Bou Arreridj']
    },
    {
        id: 35, 
        name: 'Boumerdes', 
        home: 700,  
        stopdesk: 400,
        communes: ['Boumerdes']
    },
    {
        id: 36, 
        name: 'El Tarf', 
        home: 700,  
        stopdesk: 400,
        communes: ['El Tarf']
    },
    {
        id: 37, 
        name: 'Tindouf', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Tindouf']
    },
    {
        id: 38, 
        name: 'Tissemsilt', 
        home: 800,  
        stopdesk: 400,
        communes: ['Tissemsilt']
    },
    {
        id: 39, 
        name: 'El Oued', 
        home: 900,  
        stopdesk: 500,
        communes: ['El Oued']
    },
    {
        id: 40, 
        name: 'Khenchela', 
        home: 700,  
        stopdesk: 500,
        communes: ['Khenchela']
    },
    {
        id: 41, 
        name: 'Souk Ahras', 
        home: 800,  
        stopdesk: 500,
        communes: ['Souk Ahras']
    },
    {
        id: 42, 
        name: 'Tipaza', 
        home: 700,  
        stopdesk: 400,
        communes: ['Kolea', 'Tipaza']
    },
    {
        id: 43, 
        name: 'Mila', 
        home: 600,  
        stopdesk: 400,
        communes: ['Mila']
    },
    {
        id: 44, 
        name: 'Aïn Defla', 
        home: 700,  
        stopdesk: 400,
        communes: ['Aïn Defla, Khemis Miliana']
    },
    {
        id: 45, 
        name: 'Naâma', 
        home: 1000,  
        stopdesk: 500,
        communes: ['Mecheria']
    },
    {
        id: 46, 
        name: 'Aïn Témouchent', 
        home: 800,  
        stopdesk: 400,
        communes: ['Aïn Témouchent']
    },
    {
        id: 47, 
        name: 'Ghardaïa', 
        home: 900,  
        stopdesk: 500,
        communes: ['Bordj Bou Arreridj']
    },
    {
        id: 48, 
        name: 'Relizane', 
        home: 700,  
        stopdesk: 400,
        communes: ['Relizane']
    },
    {
        id: 49, 
        name: 'Timimoun', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Timimoun']
    },
    {
        id: 51, 
        name: 'Ouled Djellal', 
        home: 900,  
        stopdesk: 500,
        communes: ['Ouled Djellal']
    },
    {
        id: 52, 
        name: 'Beni Abbes', 
        home: 1300,  
        stopdesk: null,
        communes: null
    },
    {
        id: 53, 
        name: 'In Salah', 
        home: 1300,  
        stopdesk: 600,
        communes: ['In Salah']
    },
    {
        id: 55, 
        name: 'Touggourt', 
        home: 900,  
        stopdesk: 500,
        communes: ['Touggourt']
    },
    {
        id: 57, 
        name: 'El MGhair', 
        home: 900,  
        stopdesk: null,
        communes: null
    },
    {
        id: 58, 
        name: 'El Meniaa', 
        home: 1000,  
        stopdesk: 500,
        communes: ['El Meniaa']
    },
];

// Delivery pricing by region (for other wilayas not listed above)
const defaultDeliveryPrices = {
    north: { home: 500, office: 400 },    // Northern wilayas
    center: { home: 600, office: 500 },   // Central wilayas  
    south: { home: 800, office: 600 },    // Southern wilayas
    east: { home: 550, office: 450 },     // Eastern wilayas
    west: { home: 550, office: 450 }      // Western wilayas
};

// Function to get delivery prices for a wilaya
function getDeliveryPrices(wilayaId) {
    const wilaya = wilayaData.find(w => w.id == wilayaId);
    if (wilaya) {
        return { home: wilaya.home, office: wilaya.stopdesk };
    }
    
    // Default pricing for other wilayas
    const code = parseInt(wilayaId);
    if (code <= 15) return defaultDeliveryPrices.north;
    if (code <= 30) return defaultDeliveryPrices.center;
    if (code <= 40) return defaultDeliveryPrices.east;
    if (code <= 48) return defaultDeliveryPrices.south;
    return defaultDeliveryPrices.west;
}

// Function to populate wilaya select
function populateWilayaSelect(selectElement) {
    // Add default option
    selectElement.innerHTML = '<option value="">Choisir une wilaya</option>';
    
    // Loop through wilayaData array
    wilayaData.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya.id;
        option.textContent = wilaya.name;
        selectElement.appendChild(option);
    });
}

// Function to populate commune select based on wilaya
function populateCommuneSelect(communeSelect, wilayaId) {
    communeSelect.innerHTML = '<option value="">Choisir une commune</option>';
    
    const wilaya = wilayaData.find(w => w.id == wilayaId);
    if (wilaya && wilaya.communes) {
        wilaya.communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune;
            option.textContent = commune;
            communeSelect.appendChild(option);
        });
    } else {
        // For wilayas without detailed commune data, show a generic option
        const option = document.createElement('option');
        option.value = 'commune-principale';
        option.textContent = 'Commune principale';
        communeSelect.appendChild(option);
    }
}
