const countrySelect = document.getElementById("country");
        const stateSelect = document.getElementById("state");
        const citySelect = document.getElementById("city");

 
        async function fetchCountries() {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const data = await response.json();
                const countries = data.data;

                console.log(countries);

                countries.forEach(country => {
                    const option = document.createElement("option");
                    option.value = country.country;
                    option.textContent = country.country;
                    countrySelect.appendChild(option);
                });
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        }


        async function fetchStates(country) {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ country })
                });

                const data = await response.json();
                const states = data.data.states;

                console.log(states);

                stateSelect.innerHTML = '<option value="">Please select Country first</option>';
                citySelect.innerHTML = '<option value="">Please select State first</option>';
                citySelect.disabled = true;

                states.forEach(state => {
                    const option = document.createElement("option");
                    option.value = state.name;
                    option.textContent = state.name;
                    stateSelect.appendChild(option);
                });

                stateSelect.disabled = false;
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        }

      
        async function fetchCities(country, state) {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ country, state })
                });
                const data = await response.json();
                const cities = data.data;

                console.log(cities);

                citySelect.innerHTML = '<option value="">Please select State first</option>';
                cities.forEach(city => {
                    const option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });

                citySelect.disabled = false;
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }

      
        countrySelect.addEventListener("change", () => {
            const country = countrySelect.value;
            if (country) {
                fetchStates(country);
            } else {
                stateSelect.innerHTML = '<option value="">Please select Country first</option>';
                stateSelect.disabled = true;
                citySelect.innerHTML = '<option value="">Please select State first</option>';
                citySelect.disabled = true;
            }
        });

        stateSelect.addEventListener("change", () => {
            const country = countrySelect.value;
            const state = stateSelect.value;
            if (state) {
                fetchCities(country, state);
            } else {
                citySelect.innerHTML = '<option value="">Please select State first</option>';
                citySelect.disabled = true;
            }
        });

        
        fetchCountries();