import axios from "axios";

const fetchData = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://toyby-in.vercel.app/api/reports/most-sold-products',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTczMTE3NTk1OX0.bhaHTB96SUPmPOAPJBpG-3OVulkIRmjSBmsKyLTY4Fg',
            },
            params: {
                isAdmin: true, // Body data
            },
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchData();
