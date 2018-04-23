# About

Admin homepage manager for Penn Mobile allowing admins to control which cells show up on users' phones.

Currently, making a POST request to `/homepage/order` with new parameters will change the order in which cells are displayed when you make a GET request to `homepage`.

On the backend, we will be able to customize people's experienced with each type of cell based off of the information we have about them. For instance, if a laundry cell is to displayed first, on the backend, we can look to see which laundry machines are a given person's favorites. This way, the homepage is structured, yet customized.
