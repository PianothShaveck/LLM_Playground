document.addEventListener('DOMContentLoaded', function() {
    let apiKey = ''
    let groqToken = ''
    let max_tokens = 4096;
    let temperature = 1;
    let top_p = 1;
    // Check if api key exists
    if (localStorage.getItem('apiKey') !== null) {
        apiKey = localStorage.getItem('apiKey');
        fetch(`https://api.discord.rocks/check?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.info === 'Sponsor key' || data.info === 'Premium key') {
                // Do nothing
            } else {
                showDonationModal();
            }
        })
        .catch(error => {
            console.error('Error checking API key:', error);
            showDonationModal();
        });
    }
    /**
     * A function that shows a donation / ads modal.
     */
    function showDonationModal() {
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        var modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#333';
        modalContent.style.color = '#eee';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        modalContent.style.textAlign = 'center';
        modalContent.style.width = '300px';
        /**
         * Fetches ads from 'https://api.discord.rocks/ads' and creates ad slots based on the retrieved data.
         */
        function fetchAndCreateSlots() {
            var slotsContainer = document.createElement('div');
            slotsContainer.style.display = 'flex';
            slotsContainer.style.flexDirection = 'column';
            slotsContainer.style.margin = '10px 0';
            slotsContainer.style.border = '1px solid #764941';
            slotsContainer.style.borderRadius = '5px';
            slotsContainer.style.padding = '10px';
            slotsContainer.style.backgroundColor = '#222';
            fetch('https://api.discord.rocks/ads')
                .then(response => response.json())
                .then(data => {
                    slotsContainer.innerHTML = '';
                    for (const [key, slot] of Object.entries(data)) {
                        const slotSlot = document.createElement('div');
                        slotSlot.style.width = '100%';
                        slotSlot.style.maxHeight = '200px';
                        slotSlot.style.objectFit = 'contain';
                        slotSlot.style.borderRadius = '5px';
                        slotSlot.innerHTML = `
                            <a href="${slot.url}" target="_blank">
                                <img src="${slot.image}" alt="${slot.alt}">
                            </a>
                        `;
                        slotsContainer.appendChild(slotSlot);
                    }
                })
                .catch(error => console.error('Error fetching slots:', error));
            modalContent.appendChild(slotsContainer);
        }
        fetchAndCreateSlots();
        var message = document.createElement('p');
        message.textContent = 'Help us keep this service free forever. Please consider making a donation!';
        modalContent.appendChild(message);
        var donateButton1 = document.createElement('a');
        donateButton1.href = 'https://paypal.me/thefiredragon05';
        donateButton1.textContent = 'Support Free LLMs API';
        donateButton1.style.display = 'inline-block';
        donateButton1.style.margin = '10px';
        donateButton1.style.padding = '10px 20px';
        donateButton1.style.backgroundColor = '#0070ba';
        donateButton1.style.color = '#fff';
        donateButton1.style.textDecoration = 'none';
        donateButton1.style.borderRadius = '5px';
        donateButton1.style.fontWeight = 'bold';
        modalContent.appendChild(donateButton1);
        var donateButton2 = document.createElement('a');
        donateButton2.href = 'https://paypal.me/pianoth';
        donateButton2.textContent = 'Support Chat Interface Development';
        donateButton2.style.display = 'inline-block';
        donateButton2.style.margin = '10px';
        donateButton2.style.padding = '10px 20px';
        donateButton2.style.backgroundColor = '#0070ba';
        donateButton2.style.color = '#fff';
        donateButton2.style.textDecoration = 'none';
        donateButton2.style.borderRadius = '5px';
        donateButton2.style.fontWeight = 'bold';
        modalContent.appendChild(donateButton2);
        var closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#ccc';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function(event) {
            event.stopPropagation();
            modal.style.display = 'none';
        };
        modalContent.appendChild(closeButton);
        function closeModal() {
            modal.style.display = 'none';
        }
        modal.onclick = closeModal;
        modalContent.onclick = function(event) {
            event.stopPropagation();
        };
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    const cancelSVG = `<svg id="closeSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M228 1.1c-50.8 5-99.1 24.6-137.9 55.9C22.8 111.4-11.5 206.2 4 295.5c12.6 72.1 54 135.3 114.5 174.8 86.3 56.2 198.8 55.3 285-2.4 23.9-16 39.8-30.8 56-52.4 42.9-57 60.4-129 48.5-199.2-17.4-102.1-93.8-184-194.7-208.8-24.9-6.1-60.9-8.8-85.3-6.4zm63 50.8c85.2 15.2 151.5 79.4 168.4 163.3C480 316.8 420.6 419 322 452c-75.4 25.2-159.6 4.6-215.1-52.7-47.4-48.9-67.2-117.7-53.4-185.8 6.2-30.8 20.8-62 40.8-87.3 18.4-23.3 46.7-45.5 74.5-58.4 17.5-8.1 43.1-15.3 63.2-17.8 12.7-1.5 45.9-.5 59 1.9zm-137.6 88c-10.5 4.8-16 13.9-15.2 25.1.3 3.8 1.4 8.1 2.6 10.5 1.2 2.3 17.9 19.8 40.1 42l38.1 38-38.5 38.5c-42.2 42.3-42.4 42.6-42.5 53.9 0 10.8 5.5 19.1 15.9 23.9 4.4 2 6.4 2.4 11.5 2 3.4-.3 7.7-1.3 9.6-2.3 1.9-.9 20.9-19.1 42.3-40.3l38.7-38.7 38.8 38.7c21.3 21.2 40.3 39.4 42.2 40.4 4.8 2.5 17.1 2.6 22.1.1 4.8-2.4 10.3-7.9 12.5-12.6 1-2 2-6.4 2.2-9.9.8-11.9 1.3-11.3-41.9-54.7l-38.9-39 38-38c25.9-25.9 38.7-39.4 40.1-42.3 3.1-6.4 3.6-15.7 1.2-21.3-4.8-10.7-12.6-15.9-23.9-15.9-11.8.1-11.8.1-54.1 42.3L256 218.4l-38.2-38.1c-28.5-28.4-39.5-38.7-42.8-40.2-5.9-2.7-15.9-2.8-21.6-.2z"/></svg>`
    const editSVG = `<svg id="editSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M414.1 7.5c-3 .9-7.5 2.7-10.1 4.1-3.2 1.7-57.3 55.2-176.8 174.7L52.4 362c-4.9 6.6-8.5 15.2-18 42.3L21.5 441C11.7 468.3 3 494.4 3 496.7c0 7.2 7.2 14.3 14.7 14.3 2.6 0 12-2.8 25.5-7.4L96.5 485l38.5-13.5c16.2-6.1 7.3 2.3 193.1-183.5C518 98.3 505.8 111.3 508.3 96.6c.8-4.9.8-8.3 0-13.2-2.2-12.9-4.3-15.7-30.1-41.2L449.8 15c-9.2-7.5-24.4-10.6-35.7-7.5zM436 24.3c6.3 2.9 52.1 48.2 55.2 54.6 3 6.3 3 15.9 0 22.1-1.4 2.9-8.1 10.4-18.7 21L456 138.5 416.5 99 377 58.4c0-1.6 31.1-31.9 34.8-33.8 7.5-3.9 16.3-4 24.2-.3zM237.8 227.8L89.7 375.1c-3.8 3-5.7 3.9-8.7 3.9-7.3 0-12.4-7-10-13.6.7-1.7 60.5-62.3 147.8-149.6L365.5 69l7.7 7.7 7.8 7.8-143.2 143.3zM406 110.1l13.3 14.1-143.4 143.4-147.1 145.5c-12 6.2-28.8-4.3-28.8-18.1 0-8.5-2.7-5.7 147.8-155.7L392.1 96.1c.4-.1 6.6 6.2 13.9 14zM297.1 297.4L149.2 445.3l-4.2-.6c-2.3-.3-5.3-1.5-6.6-2.8-2.7-2.5-4.1-8.1-2.8-11 .5-1.1 67-68.1 147.9-148.9l147-147 7.3 7.3 7.2 7.2-147.9 147.9zM69 391.4c3.7 2 6.8 2.9 10.5 3l5.3.1.5 5.1c1.5 14.3 15.3 28.4 29.5 30.1l4.9.5.5 6.2c.6 7.3 2.5 11.4 7.7 16.4l3.9 3.7-32.6 11.3-32.5 11.3-15.4-15.3c-8.4-8.4-15.3-15.9-15.3-16.6s5-15.7 11.2-33.3L58.4 382l2.7 3.3c1.5 1.8 5 4.5 7.9 6.1zM40.5 474c5.4 5.4 9.6 10.2 9.2 10.6-.8.9-30.1 11.2-30.6 10.8S29.4 464 30 464c.3 0 5 4.5 10.5 10z"/></svg>`
    const deleteSVG = `<svg id="deleteSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M202.1 1.1c-12.8 2.5-25.7 12.5-31.1 24.1-3.7 7.9-5 14.6-5 25.9V60h-46.4c-27.3 0-48.5.4-51.7 1-18 3.4-32.5 17.9-35.9 35.9-.5 3-1 13.4-1 23.3 0 15.9.2 18.3 2 21.8 3.1 6.1 7.8 8 19.4 8h9.5l.5 4.2c.4 2.4 6.4 75.4 13.5 162.3 13.8 168.3 13.4 164.8 19.5 174.4 6.4 10 18 17.9 29.5 20.1 7.3 1.4 254.9 1.4 262.2 0 11.5-2.2 23.1-10.1 29.5-20.1 6.1-9.6 5.7-6.1 19.5-174.4l13.5-162.3.5-4.2h9.5c11.6 0 16.3-1.9 19.4-8 1.8-3.5 2-5.9 2-21.8 0-9.9-.5-20.3-1-23.3-3.4-18-17.9-32.5-35.9-35.9-3.2-.6-24.4-1-51.7-1H346v-8.9c0-4.8-.5-11.2-1-14.2-3.4-18-17.9-32.5-35.9-35.9-6.5-1.2-100.6-1.2-107 .1zM308 32c6 3.1 8 7.8 8 19v9h-60-60v-9c0-11 2-15.9 7.8-18.9 3.5-1.9 5.9-2 52-2.1 46.5 0 48.4.1 52.2 2zm135 60c6 3.1 8 7.8 8 19v9H256 61v-9c0-11 2-15.9 7.8-18.9 3.6-2 6.5-2 187-2.1L443 92zm-23.6 62.7c-.3 2.7-6.3 75.1-13.4 161.1L393.2 472l-2.7 3.6c-5.2 6.8 3.4 6.4-134.5 6.4s-129.3.4-134.5-6.4l-2.7-3.6L106 315.8 92.6 154.7l-.5-4.7H256h163.9l-.5 4.7z"/><use xlink:href="#B"/><use xlink:href="#B" x="90"/><use xlink:href="#B" x="180"/><defs ><path id="B" d="M158.8 182.1c-2.3 1.2-4.6 3.5-5.8 5.9-2 3.9-2 5.7-2 113s0 109.1 2 113c2.3 4.5 8 8 13 8s10.7-3.5 13-8c2-3.9 2-5.7 2-113s0-109.1-2-113c-3.7-7.3-12.7-9.9-20.2-5.9z"/></defs></svg>`
    const copySVG = `<svg id="copySVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M248 .6c-10.6 1.9-18.3 5.1-26.6 11-10.1 7.1-16.5 16-22 30.4-4 10.4-9.3 15.7-20.3 19.9-9.5 3.7-14.5 6.6-21.8 12.7l-5.1 4.4h-29.9c-31.2 0-34.2.4-42.9 4.8-9.1 4.7-17.3 16.3-19.4 27.1-1.4 7.3-1.4 361.8 0 369.1 2.9 15.3 15.7 28.1 31 31 7.2 1.4 322.8 1.4 330 0 15.3-2.9 28.1-15.7 31-31 1.4-7.3 1.4-361.8 0-369.1-2.1-10.8-10.3-22.4-19.4-27.1-8.7-4.4-11.7-4.8-43-4.8h-29.9l-5.1-4.3c-7.3-6.2-12.2-9.1-21.7-12.8-11-4.2-16.3-9.5-20.3-19.9-8.1-21.3-20.3-33.2-40.6-39.6-4.7-1.5-19.7-2.6-24-1.8zM268.6 22c11.5 4 20.2 12.6 24.5 24.5 7 19.1 15.5 27.5 34.4 34.4 11.5 4.2 20.6 13.2 24.6 24.5 1.5 4.4 1.9 8.2 1.9 19.1V138h-98-98v-13.5c0-10.9.4-14.7 1.9-19.1 4-11.3 13-20.3 24.5-24.4 18.8-6.8 27.5-15.4 34.5-34.5 7.6-20.7 29.3-31.4 49.7-24.5zM141 98.3c0 .1-.7 3.4-1.5 7.2-1 5-1.5 13.5-1.5 29.7V158h118 118v-22.8c0-16.2-.5-24.7-1.5-29.7l-1.5-7.3c0-.2 10.7-.2 23.8 0l23.9.3 4.8 3c3.2 2 5.6 4.5 7.2 7.4l2.3 4.4-.2 183.2-.3 183.2-2.7 3.6c-1.6 1.9-4.3 4.6-6 5.9l-3.3 2.3H256 91.5l-3.3-2.3c-1.7-1.3-4.4-4-6-5.9l-2.7-3.6-.3-183-.2-183 2.1-4.4c2.4-5 8.1-9.3 13.7-10.4 3.3-.6 46.2-1.2 46.2-.6zm109.3-52.4c-12.7 5.9-10.3 25.1 3.3 27.7 4.7.9 11.8-1.9 14.5-5.8 8.7-12.1-4.3-28.1-17.8-21.9zM138 226.5v9.5h118 118v-9.5-9.5H256 138v9.5zm0 59v9.5h118 118v-9.5-9.5H256 138v9.5zm0 59v9.5h118 118v-9.5-9.5H256 138v9.5zm0 59.5v10h59 59v-10-10h-59-59v10z"/></svg>`
    const generateSVG = `<svg id="generateSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M356.5 8.4c-1.3 1.3-2.7 4-3 6-.4 2-1.1 3.9-1.7 4.2-.5.3-3.1.1-5.7-.6-4.2-1-5.4-.9-8 .5-3.1 1.6-5.1 4.9-5.1 8.5 0 3.3 4.7 7.7 9.6 8.9 3.7 1 4.5 1.5 3.9 2.9-.3.9-.9 3.8-1.2 6.4-.5 4.3-.3 5 2.5 7.7 5.8 5.9 13 3.1 15.3-6 1.1-4.3 1.6-4.9 3.4-4.4 9.1 2.5 14.5 1.2 16.6-4.2 2.2-5.8-1.8-11-10-12.8-3.2-.7-3.3-.8-2.6-4.4 1.4-6.5 1-10-1.5-12.6-3.2-3.4-9.1-3.5-12.5-.1zM276.6 47c-1.6.5-4 1.9-5.3 3.2-5.3 4.9-5.3 4.8-5.3 46.5v38.9l-30.8 21.7c-17.1 12.1-31.5 23-32.4 24.5-4.2 7-2.4 16.5 3.8 20.9 1.6 1.1 10 4.2 18.7 6.9l15.8 4.8-117.9 118.1C-6.9 462.7 1.5 453.5.3 467.9c-1.9 22.7 17.4 41.9 40 39.8 14.6-1.4 5.9 6.5 135.7-123.3l117.6-117.5 4.8 15.8c2.6 8.7 5.7 17.1 6.8 18.7 4.5 6.3 14.5 8 21.1 3.7 1.5-1 12.6-15.6 24.5-32.5l21.7-30.7 38.8.1c42.4.1 41.9.1 47-5.9 2.9-3.5 4.1-9.3 2.8-13.7-.5-1.7-10.7-16.3-22.8-32.5l-22.5-30.5c-.4-.6 4.7-17 11.3-36.5 10.2-29.9 12-36.1 11.6-40-.7-8.1-7-13.9-15-13.9-1.9 0-18.9 5.2-37.8 11.7L350 92.4c-.8 0-14.9-10-31.3-22.3-16.4-12.2-31.2-22.7-33-23.2-3.7-1.1-5.2-1-9.1.1zm32 38.3c32.4 24.2 34.7 25.7 39.9 25.7 2.9 0 15.1-3.7 37-11.1 17.9-6.1 32.9-10.9 33.2-10.5.3.3-4.4 15.3-10.6 33.3-7.3 21.4-11.1 34.3-11.1 37 0 3.3 1 5.6 4.6 10.9 3.6 5.2 33.2 45.2 38.7 52.2.9 1.2-5 1.3-35.8 1.1-35.7-.4-37.1-.3-40.5 1.7-2.5 1.4-9.2 10.1-24 31.1l-21.1 29.2c-.3.1-5.2-14.9-10.9-33.2-5.6-18.2-11-34.5-11.9-36-.9-1.6-2.9-3.7-4.6-4.7-2.5-1.5-25.7-9-62.7-20.3-3.8-1.1-6.8-2.3-6.7-2.6 0-.3 13.1-9.8 29.2-21.1 21-14.8 29.7-21.5 31.1-24 2-3.4 2.1-4.8 1.7-40.5-.2-30.8-.1-36.7 1.1-35.8.7.5 11.2 8.5 23.4 17.6zm-37.3 138.6c4.9 1.5 9.2 3.2 9.6 3.7s2 5.1 3.6 10.2l2.9 9.3-74.2 74.2-74.2 74.2-13.2-13.3-13.3-13.2 74-74 75-74c.5 0 5 1.3 9.8 2.9zm-184 223.4c-25.7 25.7-40.2 39.5-42.8 40.8-9.4 4.4-20.1.2-24.6-9.6-2.3-4.9-2.4-9.4-.4-14.3 1.1-2.5 14.1-16.2 40.8-42.9L99.5 382l13.2 13.2 13.3 13.3-38.7 38.8zM162.8 73c-1.7 1.3-3.1 4.1-4.3 8.5-2 7.3-2.2 7.3-10 5-6-1.9-9.8-1.2-12.5 2.2-2.3 2.9-2.6 6.4-.8 9.6 1.7 3.2 3.6 4.3 9.6 5.8 3 .7 5.6 1.8 5.9 2.5s-.3 3.8-1.2 6.9c-1.7 6.1-1.4 8.8 1.8 12.2 1.4 1.6 3.2 2.3 5.7 2.3 5.5 0 7.7-2.2 10-10.1 1.9-6.4 2.3-7 4.3-6.5 8.8 2.6 12.9 3 15.4 1.6 5.7-3.2 6-12.6.5-15.4-1.5-.7-5.1-1.9-7.9-2.7-2.9-.7-5.3-1.6-5.3-1.9 0-.4.7-2.9 1.5-5.6 2.3-7.7 2-10.8-1.6-13.8-3.7-3.1-7.7-3.3-11.1-.6zm320.3 48.7c-1.7 1.8-3.2 4.9-4.1 8.6-1.2 5.2-1.6 5.8-3.4 5.2-12.4-3.6-16.7-3-19.1 2.9-2.8 6.8.6 11.1 10.8 13.7 5.3 1.3 5.5 1.8 3.2 9.3-1.7 5.5-1.3 8 1.8 11.3 1.4 1.6 3.2 2.3 5.7 2.3 6.1 0 8.4-2.6 11-12.6l1-4.2 4.7 1.4c2.5.8 6.3 1.4 8.5 1.4 6.7 0 10.5-6.2 7.5-12.6-1.4-2.9-2.6-3.6-8.7-5.5-3.8-1.1-7-2.2-7-2.2 0-.1.7-2.7 1.5-5.7 2.1-7.8 1.9-9.8-1.4-13.1-3.9-3.8-8.3-3.9-12-.2zm-74.3 255.2c-1.3 1.1-3 3.8-3.7 6.1-1.1 3.6-1.5 4-3.4 3.3-4.7-1.7-9.8-.8-12.3 2.1-4.6 5.3-1.9 12.5 5.7 14.7 4.4 1.4 4.3 1.1 2.8 6.3-1.4 5.1.2 9 4.7 11.1 5.8 2.7 10.1.4 12.8-7.1.8-2.4 1.9-3.8 2.7-3.5 5 1.3 9.1 1.2 11.2-.2 6.7-4.4 5-13.9-3-16.5l-4.3-1.4.7-5.8c.5-5.3.4-6-2-8.4-3.2-3.2-8.3-3.5-11.9-.7z"/></svg>`
    const sendSVG = `<svg id="sendSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M499.5 7.4c-1.6.8-113.7 48.7-249 106.5L2.3 221.6c-2.9 3.2-2.9 6.6 0 9.8 1.2 1.3 33 22.1 70.7 46.1l70.1 45.4c.9.9 10.6 36.7 23.8 87.6l23.3 89.3c1.1 3.8 5.8 6.7 9.4 5.8 1.3-.4 3.6-1.8 5.1-3.2l88.8-81.2c.7-.2 22.9 10.7 49.3 24.2 30.7 15.8 49 24.6 50.9 24.6 1.8 0 3.8-.9 5.1-2.3 1.7-1.8 13.5-48.6 57.8-227.8l55-228.2c-.6-2.6-5-5.7-7.8-5.7-.7.1-2.6.7-4.3 1.4zm-43.5 37c0 .5-304.1 262.2-305.3 262.8-.8.3-124.5-78.3-124.6-79.2-.1-.5 427.5-183.7 429.2-183.9.4-.1.7.1.7.3zm29.4 11.3c-.3 1-22.2 89.9-48.8 197.6l-48.8 196.2c-.5.5-37.3-18.2-111.3-56.3-15.9-8.2-26.9-14.4-26.7-15.2.2-1.1 235.2-324 235.8-324 .1 0 0 .8-.2 1.7zm-36.3 20L336.6 230 229 377.5 213.9 423l-15.2 45.4-18.3-70.4-19.2-73.7-1-3.2 62.7-53.9L453.6 69c.2 0-1.8 3-4.5 6.7zM260 403.3l18 9.4-29.7 27.4-30.9 28.2c-.9.5-.7-1 .6-5l23.6-69.3c.2 0 8.5 4.2 18.4 9.3z"/></svg>`
    const addSVG = `<svg id="addSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M237 .6l-13 1.5c-79.1 9-152.2 58.6-192.4 130.5C17 158.8 6.4 191.4 1.9 224c-1.8 12.5-1.8 51.5 0 64C12.4 364.2 53 428.9 116.5 470.6c84 55.2 195.6 55 279.7-.4 126.6-83.5 153.9-257.1 59.1-374.7-40.9-50.7-97.4-82.9-163.3-93C282 1 244.8-.3 237 .6zM276.1 41c16 1.6 31 4.8 47.3 10.1 48.8 16 89.3 48.1 117.1 92.9 23.7 38.3 34.9 87.2 30.4 132.6-6.7 67.8-44.2 127.4-102.9 163.9-38.3 23.7-87.1 34.9-132.6 30.4-85.4-8.4-157.8-66.4-184.3-147.5-14.8-45.2-14.8-89.6 0-134.8 12.3-37.7 35.3-72 64.9-96.9C160.9 53.9 219.3 35.5 276.1 41zM236 191v45h-45-45v20 20h45 45v45 45h20 20v-45-45h45 45v-20-20h-45-45v-45-45h-20-20v45z"/></svg>`
    const runSVG = `<svg id="runSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M468.5 1.1c-70.2 4.7-140.4 26-196.5 59.7-16.3 9.7-28.7 18.4-43.7 30.4l-12.1 9.8h-45.9-45.8l-61.8 61.8L1 225.3c0 .4 29 .7 64.5.7l64.5.5c0 .3-1.5 5.6-3.4 11.8-3.4 11.3-7.9 32.2-9.1 42.7l-.6 5.5 54.4 54.4 54.5 54.4 8.3-1.3c12.7-1.8 26.2-4.7 37.9-8.1l12.3-3.6c1.6-.5 1.7 3 1.7 64.1l.8 64.6c.4 0 28.5-27.8 62.5-61.8l61.7-61.7v-46-46.1l6.4-7.6c31.4-37.8 54.5-80.2 71.3-130.6 14.5-43.9 21.5-84.8 23-134.5l.6-22.7-15.9.1c-8.7.1-21.3.5-27.9 1zm20.2 36.1C486 96 469 159.3 442.3 210c-41.6 79-104.2 133.5-177.7 154.6-6.6 1.9-16.2 4.2-21.3 5.1l-9.4 1.7-46.5-46.5-46.5-46.4.6-5.5c.9-7.4 6.6-29.4 10.5-40.5C189.7 126.1 301.4 45.8 437.5 27.1c17.9-2.5 31.9-3.8 43.4-4l8.4-.1-.6 14.2zM192 124.6c0 .3-2.8 3.7-6.2 7.5-14.6 16.3-32.5 42.9-42.4 63.1l-3.8 7.8H97 54.5L94 163.5l39.5-39.5h29.2c16.1 0 29.3.3 29.3.6zM348.5 418L309 457.5V415v-42.5l10.9-5.7c20.8-10.8 46.7-28.5 61.6-42.1l6-5.4.3 29.6.2 29.6-39.5 39.5zm.6-326.9c-17.3 2.9-34.7 15.3-43.5 31.2-13.2 23.6-8.8 54.1 10.6 73.5 11.2 11.3 24.3 17.1 40.3 17.9 18.6 1 33.9-4.9 47-18.1 22.2-22.3 24.3-55.5 5.1-81.4-12.9-17.4-37.1-26.8-59.5-23.1zm26.9 25.5c27 12.6 30.9 49 7.3 67-15.2 11.6-37.8 9.8-51.4-4-20.2-20.5-12.1-54.6 15.4-64.7 8.1-2.9 20.3-2.2 28.7 1.7zM69.7 347.8L35 382.5l8 8 8 8L85.5 364c19-19 34.5-34.9 34.5-35.5 0-1-14-15.5-15-15.5-.3 0-16.1 15.6-35.3 34.8zM87 409.5L35.5 461l7.8 7.7 7.7 7.8 51.7-51.7 51.8-51.8-7.5-7.5c-4.1-4.1-7.7-7.5-8-7.5s-23.7 23.2-52 51.5zm61 17L113.5 461l8 8 8 8 35-35 35-35-7.5-7.5c-4.1-4.1-7.9-7.5-8.5-7.5-.5 0-16.5 15.5-35.5 34.5z"/></svg>`
    const exportSVG = `<svg id="exportSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M209.8 39c-2 1.1-4.7 3.6-6 5.7l-2.3 3.8-.3 85.2-.2 85.2-29.8.3c-35 .4-35.7.5-40.4 9.8-3.2 6.1-3.5 10.4-1.3 15.8 1.1 2.5 18.3 20.4 54.8 57.1l58.9 58.1c6.5 5.5 11.2 6.8 17.9 5 3.9-1.1 10.3-7.1 60.7-57.3l58.9-60c3.9-5.7 4.1-11.9.6-18.6-4.8-9.4-5.4-9.5-40.5-9.9l-29.8-.3-.2-85.2-.3-85.2-2.4-3.8c-1.2-2.1-4-4.6-6.2-5.7-3.6-1.9-6-2-46.1-2-39.8.1-42.5.2-46 2zM48.9 330c-4.4 1.3-7.9 4.2-10 8.1-1.8 3.6-1.9 6.2-1.9 47.5 0 36.5.3 44.6 1.6 49.8 4.7 18.4 19.6 33.1 38.4 38.1 8.2 2.2 349.8 2.2 358 0 19.1-5.1 33.4-19.4 38.5-38.5 1.2-4.4 1.5-14.2 1.5-49.3 0-41.6-.1-44-2-47.6-4.9-9.7-19.9-11.9-28.4-4.2-5.5 5.1-5.6 5.5-5.6 49.8 0 37.4-.2 41.1-1.9 44.8-2.2 4.8-4.4 6.9-9.4 9-3.2 1.3-22.7 1.5-171.7 1.5s-168.5-.2-171.7-1.5c-5-2.1-7.2-4.2-9.4-9-1.7-3.7-1.9-7.4-1.9-44.8 0-44.3-.1-44.7-5.6-49.8-4.8-4.4-12-5.9-18.5-3.9z"/></svg>`
    const importDataSVG = `<svg id="importDataSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M247.5 38.9c-1.6 1-29 27.9-60.7 59.7-63.6 63.9-60.6 60.2-57.9 70.4 1.5 5.6 3.8 8.9 8.2 11.5 3.2 1.9 5.5 2 33.7 2.3l30.2.3v83.2l1.1 87.2c1.4 5 6.4 10 11.4 11.4 5.5 1.5 79.5 1.5 85 0 5-1.4 10-6.4 11.4-11.4.7-2.8 1.1-29.9 1.1-87.2v-83.2l30.3-.3c28.1-.3 30.4-.4 33.6-2.3 4.4-2.6 6.7-5.9 8.2-11.5 2.7-10.2 5.8-6.5-58.4-70.8l-60.9-59.8c-3.9-2-12.7-1.8-16.3.5zM48.9 330c-4.4 1.3-7.9 4.2-10 8.1-1.8 3.6-1.9 6.2-1.9 47.5 0 36.5.3 44.6 1.6 49.8 4.7 18.4 19.6 33.1 38.4 38.1 8.2 2.2 349.8 2.2 358 0 19.1-5.1 33.4-19.4 38.5-38.5 1.2-4.4 1.5-14.2 1.5-49.3 0-41.6-.1-44-2-47.6-4.9-9.7-19.9-11.9-28.4-4.2-5.5 5.1-5.6 5.5-5.6 49.8 0 37.4-.2 41.1-1.9 44.8-2.2 4.8-4.4 6.9-9.4 9-3.2 1.3-22.7 1.5-171.7 1.5s-168.5-.2-171.7-1.5c-5-2.1-7.2-4.2-9.4-9-1.7-3.7-1.9-7.4-1.9-44.8 0-44.3-.1-44.7-5.6-49.8-4.8-4.4-12-5.9-18.5-3.9z"/></svg>`
    const deleteDataSVG = `<svg id="deleteDataSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M68.3 33.5c-8.5 2.3-15.3 6.3-21.9 12.9-6.7 6.7-10.6 13.4-12.9 22.3-2.2 8.6-2.2 238 0 246.6 2.3 8.9 6.2 15.6 12.9 22.3C56.8 348 67.6 352 85.8 352H96v10.8c0 17.8 3.9 28.3 14.4 38.8 10.4 10.4 21.2 14.4 39.4 14.4H160v10.8c0 17.8 3.9 28.3 14.4 38.8 3.4 3.4 8.5 7.3 11.4 8.8 11.3 5.7 7.5 5.6 133.8 5.6l121.5-1c18.3-3.5 34.4-19.6 37.9-37.9 1.4-7.4 1.4-234.8 0-242.2-2.5-12.9-12.5-26.7-23.8-32.7-8.6-4.6-16-6.2-28.4-6.2H416v-9.9c0-17.9-3.5-28.2-13.3-38.7-10.1-10.9-21.8-15.4-39.9-15.4H352v-9.9c0-5.4-.5-12.2-1-15.2-2.5-12.9-12.5-26.7-23.8-32.7-12.2-6.5-5.7-6.2-135.7-6.1L68.3 33.5zm244.3 33.1c6 4.4 6.9 6.7 7.2 18.5l.4 10.9h-90.9c-98.8 0-96.2-.1-107.5 5.6-6.7 3.4-16.8 13.5-20.2 20.2-5.7 11.3-5.6 8.7-5.6 107.5v90.9l-10.9-.4c-11.8-.3-14.1-1.2-18.5-7.2-2.1-2.7-2.1-3.4-2.4-117.9l.3-118.4c.7-4 4.9-9.1 9-10.9 2.4-1.1 24.2-1.3 119.7-1.1 116.1.2 116.7.2 119.4 2.3zm64 64c6 4.4 6.9 6.7 7.2 18.5l.4 10.9h-90.9c-98.8 0-96.2-.1-107.5 5.6-6.7 3.4-16.8 13.5-20.2 20.2-5.7 11.3-5.6 8.7-5.6 107.5v90.9l-10.9-.4c-11.8-.3-14.1-1.2-18.5-7.2-2.1-2.7-2.1-3.4-2.4-117.9l.3-118.4c.7-4 4.9-9.1 9-10.9 2.4-1.1 24.2-1.3 119.7-1.1 116.1.2 116.7.2 119.4 2.3zm64 64c1.5 1.1 3.7 3.3 4.8 4.8 2.1 2.7 2.1 3.1 2.1 120.6s0 117.9-2.1 120.6c-1.1 1.5-3.3 3.7-4.8 4.8-2.7 2.1-3.1 2.1-120.6 2.1s-117.9 0-120.6-2.1c-1.5-1.1-3.7-3.3-4.8-4.8-2.1-2.7-2.1-3.4-2.4-117.9l.3-118.4c.7-4 4.9-9.1 9-10.9 2.4-1.1 24.2-1.3 119.7-1.1 116.1.2 116.7.2 119.4 2.3zm-181.9 53.8c-4.5 1.7-7.4 4-9.4 8-1.8 3.4-1.9 10.5-.3 13.8.7 1.2 11.8 13 24.8 26l23.7 23.8-23.7 23.7c-13 13.1-24.1 24.9-24.8 26.1-2.6 5.3-.8 14.4 3.6 18.3 4.7 4.1 12.6 5.4 17.6 2.9 1.2-.7 13-11.8 26.1-24.8l23.7-23.7 23.8 23.7c13 13 24.8 24.1 26 24.8 5 2.5 12.9 1.2 17.6-2.9 4.4-3.9 6.2-13 3.6-18.3-.7-1.2-11.8-13-24.8-26.1L342.5 320l23.7-23.8c13-13 24.1-24.8 24.8-26 1.6-3.3 1.5-10.4-.4-14-3.4-6.5-11.1-9.9-18.1-8.1-3.3.9-8 5.1-28.2 25.2L320 297.4l-24.2-24.1c-20.1-19.9-25-24.3-28.3-25.2-4.8-1.3-4.1-1.3-8.8.3z"/></svg>`
    const searchSVG = `<svg id="searchSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M181.7 1.6C108.2 10.5 43.3 60.3 15.3 129.4-12 197-2 273.3 41.9 332c7 9.4 24.4 27.4 33.7 35.1 37.4 30.6 83 46.9 131.1 46.9 41.9 0 79.3-11 114.2-33.7l8.4-5.5 64.6 64.5c44.1 44.1 66 65.2 69.1 66.8 3.8 2 6 2.4 14 2.4 11.2 0 16.6-2.1 23.2-9.3 6.1-6.7 8.3-12.2 8.3-21.7 0-14.1 2.7-10.9-69.8-83.4l-64.5-64.4 4-5.6c13.4-19.1 25-45.5 30.8-70.5 7.2-30.4 6.6-68.2-1.5-99-13.3-50.7-46.8-95.9-91.7-123.8C276.7 6.6 228.3-4 181.7 1.6zM236 66.5c18.2 4 35.8 11.5 51.1 21.6 10.8 7.3 26.7 22.3 34.3 32.3 28.4 37.8 36.7 86.6 22.1 131.2-11.9 36.5-37.7 66.4-72 83.6-39.3 19.8-84 20.5-124.3 2.2-16.3-7.4-30.4-17.6-43.8-31.7C84.5 286 72.2 262.4 66.3 235c-2.6-12.2-2.6-44 .1-55.9 6.2-28.7 19.4-52.9 39.6-73.1 22.1-22.1 49.7-36.1 80.5-40.9 9.1-1.5 40.6-.5 49.5 1.4z"/></svg>`
    const settingsSVG = `<svg id="settingsSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M224.5.9c-5 1.3-11.2 4.9-15.1 8.8-6.5 6.4-8.1 11.7-11.1 35.4-1.4 11.8-3.1 21.9-3.6 22.6s-2.5 1.7-4.5 2.3c-2 .7-8.3 3.2-14 5.7l-10.3 4.6-3.7-3C144.9 63.6 131.8 53.9 128 52c-6.1-3.1-15.9-3.8-23.6-1.5-5.7 1.6-6.7 2.5-29.1 24.8C53 97.7 52.1 98.7 50.5 104.4c-2.3 7.8-1.6 17.5 1.5 23.6 1.3 2.5 7.6 11.2 14 19.5 15.9 20.3 14.8 18 11.3 25-1.7 3.3-4.3 9.4-5.8 13.5s-3.3 8-3.9 8.6-10.8 2.3-22.6 3.8c-23.8 3-28.9 4.6-35.3 11-2.1 2-4.9 6-6.5 8.9l-2.7 5.2v32 32l2.6 5.6c1.5 3.1 4.3 7.3 6.4 9.4 6.6 6.6 12 8.3 34.7 11.1 11.1 1.3 21.2 2.8 22.3 3.3 1.2.5 2.8 3 3.9 6.2 1 3 3.7 9.3 5.9 14.1 2.7 6.1 3.7 9.2 3 10-.5.7-6.4 8.3-13 16.8s-13 17.5-14.3 20c-3.1 6.1-3.8 15.8-1.5 23.6 1.6 5.7 2.5 6.7 24.8 29.1 22.4 22.3 23.4 23.2 29.1 24.8 7.7 2.3 17.5 1.6 23.6-1.5 3.8-1.9 16.9-11.6 34.2-25.3l3.7-3 10.3 4.6c5.7 2.5 12 5 14 5.7 2 .6 4 1.6 4.5 2.3s2.2 10.8 3.6 22.6c3 23.8 4.6 29 11.2 35.6 2.1 2.1 6.3 4.9 9.4 6.4l5.6 2.6H256h31.5l5.6-2.6c3.1-1.5 7.3-4.3 9.4-6.4 6.7-6.7 8.3-12 11.2-35.7 1.4-11.7 3.1-21.8 3.7-22.4s4.5-2.4 8.6-3.9 10.2-4.1 13.5-5.8c7-3.5 4.7-4.6 25 11.3 8.3 6.4 17 12.7 19.5 14 6.1 3.1 15.8 3.8 23.6 1.5 5.7-1.6 6.7-2.5 29.1-24.8 22.3-22.4 23.2-23.4 24.8-29.1 2.3-7.8 1.6-17.5-1.5-23.6-1.8-3.5-11.2-16.2-27.3-36.7-.6-.9.5-4.5 3.6-11.5 2.5-5.7 5-12 5.7-14 .6-2 1.6-4 2.3-4.5s10.8-2.2 22.6-3.6c23.8-3 29-4.6 35.6-11.2 2.1-2.1 4.9-6.3 6.4-9.4l2.6-5.6V256v-31.5l-2.6-5.6c-1.5-3.1-4.3-7.3-6.4-9.4-6.6-6.6-11.9-8.2-35.9-11.4-11.9-1.5-22-3.2-22.5-3.7s-2.1-4.3-3.6-8.4-4.1-10.2-5.8-13.5c-3.5-7-4.6-4.7 11.3-25 6.4-8.3 12.7-17 14-19.5 3.1-6.1 3.8-15.8 1.5-23.6-1.6-5.7-2.5-6.7-24.8-29.1-22.4-22.3-23.4-23.2-29.1-24.8-7.8-2.3-17.5-1.6-23.6 1.5-2.5 1.3-11.2 7.6-19.5 14-20.3 15.9-18 14.8-25 11.3-3.3-1.7-9.4-4.3-13.5-5.8s-8-3.3-8.6-3.9-2.3-10.7-3.7-22.5c-3-23.8-4.6-28.9-11.2-35.6-2.1-2.1-6.3-4.9-9.4-6.4L287.5.5l-30-.2c-16.5-.1-31.3.2-33 .6zm59.4 21.4c5.4 2.7 6.1 4.9 9.6 32.2 2.5 19.8 3.7 26.3 5.1 28.2 1.4 1.8 5.4 3.7 14 6.8 6.6 2.3 16.9 6.6 22.9 9.5 9.5 4.6 11.2 5.1 13.9 4.3 1.7-.5 12.3-8.1 23.6-16.9 27.5-21.4 23.1-21.8 48.7 3.9 25.7 25.6 25.4 21 3.6 49.1-8.9 11.5-16.5 22.3-16.9 23.8-.4 2.3.6 5.3 4.6 13.6 2.9 5.8 7 15.5 9.2 21.5 4.7 13.2 5.2 14.3 8 15.8 1.2.7 13.7 2.7 27.7 4.5 26.9 3.4 29.1 4.1 31.8 9.5 1.8 3.4 1.8 52.4 0 55.8-2.7 5.4-4.9 6.1-31.9 9.5-14 1.9-26.4 3.9-27.6 4.5-2.8 1.5-3.4 2.6-8.1 15.9-2.1 6.1-6.3 15.8-9.1 21.7-4.7 9.5-5.2 11-4.3 13.9.5 1.7 8.1 12.3 16.9 23.6 21.4 27.5 21.8 23.1-3.9 48.7-25.6 25.7-21 25.4-49.1 3.6-11.5-8.9-22.3-16.5-23.8-16.9-2.3-.4-5.3.6-13.6 4.6-5.8 2.9-15.6 7-21.7 9.2-6 2.2-12 4.6-13.2 5.4-3.1 2-3.9 5.7-7.2 32.3-3.1 24.7-3.8 27.1-9.2 29.8-3.4 1.8-52.4 1.8-55.8 0-5.4-2.8-6.1-4.9-9.5-32.1-2.6-20.1-3.7-26.3-5.2-28.3-1.4-1.8-5.3-3.7-13.9-6.8-6.7-2.3-16.9-6.6-22.8-9.4-8.4-4.1-11.3-5.1-13.6-4.6-1.6.3-11.6 7.4-22.2 15.6-10.7 8.3-20.7 15.8-22.2 16.6-5.9 3-7.8 1.7-28.7-19.2-25.3-25.4-25-20.9-3.3-48.9 8.9-11.5 16.5-22.2 16.8-23.7.5-2.1-.6-5.4-4.5-13.4-2.8-5.9-7-15.7-9.1-21.8-2.2-6.2-4.7-12.2-5.5-13.4-2-3.1-5.7-3.9-32.3-7.2-24.7-3.1-27.1-3.8-29.8-9.2-1.8-3.4-1.8-52.4 0-55.8 2.7-5.4 5.1-6.1 29.8-9.2 26.6-3.3 30.3-4.1 32.3-7.2.8-1.2 3.2-7.2 5.4-13.2 2.2-6.1 6.3-15.9 9.2-21.8 4.7-9.6 5.2-11.2 4.3-14-.5-1.8-8.1-12.4-16.9-23.7-21.4-27.5-21.8-23.1 3.9-48.7 25.6-25.7 21.2-25.3 48.7-3.9 11.3 8.8 21.9 16.4 23.6 16.9 2.8.9 4.5.4 14.6-4.6 6.2-3 16-7.1 21.8-9.2 5.8-2 11.5-4.3 12.7-5 3.1-2.1 3.9-5.8 7.2-32.4 3.1-24.7 3.8-27.1 9.2-29.8 1.7-.9 9.6-1.3 27.9-1.3s26.2.4 27.9 1.3zM243.8 150c-36.9 4.6-68.3 27.5-84.3 61.3-19.2 40.7-10.2 89.4 22.3 120.9 32.1 31 79.2 39.2 118.7 20.4 23.8-11.2 40.9-28.3 52-51.9 25.9-54.8.2-119.9-56.8-143.6-14.7-6.1-36.4-9.1-51.9-7.1zm29.2 22.4c22.1 4.7 41.2 17.7 53.9 36.6 9.7 14.5 14.1 29.4 14.1 47.4-.1 28.9-13.7 54.1-38.1 70.5-9.3 6.3-21.7 11.3-32.5 13.2-3.9.7-11.7 1-18.8.7-14.6-.6-26.4-4.1-39.1-11.6-9.5-5.6-22.4-18-28.3-27.2-4.9-7.5-9.8-19.6-11.8-29-1.8-8.4-1.8-25.6 0-34 7.1-33.3 32.8-59.2 66.1-66.5 8-1.8 26.4-1.8 34.5-.1z"/></svg>`
    const backSVG = `<svg id="backSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M232.1 1C145.3 9.4 67.7 62 28.4 139.2c-13.9 27.3-22.1 53.6-26.6 85.3-2 14-1.7 50.4.6 66 3.9 27.8 12.1 54.1 24.7 79.4 24.9 50.2 64.7 90 115 115 81.5 40.6 177.9 35 253.9-14.7 29.7-19.4 57.9-48.2 77.1-78.8 7.4-11.6 18.4-34.2 23.4-47.8 5.1-13.8 11-37.6 13.1-53.1 2.3-15.7 2.6-52.1.6-66-4.3-29.9-12-55.4-24.6-81C447.8 66.7 376.6 15 291.5 2.4 279.3.6 244.9-.2 232.1 1zm-10.2 133.3c5.5 3.7 8.9 9.2 10.3 16.6 1 5.2.9 6.9-.6 11.6-1.5 4.9-4.5 8.4-32.3 38.2l-30.7 32.8 116 .5c129.9.6 118.7-.2 125.7 8 9.2 10.8 6.6 26.9-5.7 34.5l-4.9 3-115.4.5-115.3.5 29.1 31c15.9 17 30.1 32.8 31.4 35.1 13.4 22.2-16 45.8-35.1 28.2-2.4-2.2-24.1-25.1-48.1-50.9-50-53.5-49.7-53.2-49.8-66.9 0-14.2-1-13 50.8-68.5l49.1-51.8c7.5-6.3 18.1-7.3 25.5-2.4z"/></svg>`
    const shareSVG = `<svg id="shareSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M411.8 5.1c-20.2 3-37.2 11.4-51.1 25.3-7.6 7.6-12.5 14.8-17.7 25.9-6.1 13.1-7.4 19.2-7.5 35.3v14.2l-88.3 48.1-88.4 48.1-7.1-7.4c-11.7-11.8-24-19.1-40.4-23.8-11.3-3.3-34.3-3.3-45.8 0-31.3 8.9-54.6 32.8-63.1 64.7-2.7 10.3-2.5 32.1.5 43 11.9 44 55.5 72.7 99 65.1 19.9-3.5 33.4-10.3 47.8-24l9.3-8.8 49.8 27 88 47.9 38.2 20.8.4 14.5c.3 16.5 1.8 23 7.7 35.8 5.1 11.1 11.2 19.4 20.2 27.8 12 11.1 26.9 18.8 42.6 22 11.3 2.2 31.5 1.5 41.6-1.5 33.4-9.9 57.9-37.7 63.4-72.1 4.2-25.4-4.5-53.8-22.2-72.6-11.2-12-22.4-19.3-37.2-24.3-32.6-10.9-67.1-2.7-91.2 21.8-6.2 6.3-9.2 10.4-15.6 21.3l-2.2 3.7-85.5-46.5-85.8-46.9c-.1-.1.9-4.2 2.4-9.1 2.4-8 2.7-10.5 2.7-23.9.1-12.6-.3-16.2-2.2-22.5-1.2-4.1-2.3-8.3-2.4-9.3-.2-1.5 17.1-11.3 84.3-47.9l85.6-46.5c.7-.2 2.7 2.2 4.5 5.4 16 28.3 44.7 45.2 77.1 45.3 21.4 0 39-6.3 56.7-20.3 12.9-10.3 24.9-29.2 29.1-46.1 10.7-42.4-12-87.4-52.2-103.5-13.2-5.3-32.4-7.9-45-6zM443 31.9c18.8 6 35 22.2 41.2 41.1 2.9 9 3.5 25.1 1.4 34.5-4.2 18-17.2 34.4-33.6 42.4-11.1 5.4-20.8 7.4-32.6 6.8-26.2-1.5-48.8-18.9-57-44-3.8-11.3-4-27.7-.5-38.2 7.6-23.2 26.8-40.4 50.1-44.9 6.1-1.1 24.6.2 31 2.3zM106 194.6c10.4 3 19 8.3 27.5 16.9 13.3 13.2 18.8 26.4 18.9 45 .1 21.5-10 40.5-28.2 52.9-9.7 6.7-19.3 9.8-31.9 10.4-12.8.6-20.4-.8-30.8-5.7-23.3-10.9-36.8-32.4-36.6-58.1.1-18.1 5.7-31.6 18.6-44.6 10.5-10.5 21.1-16 36.5-18.8 4.7-.9 20.5.3 26 2zm338.2 164.6c18.9 7.1 32.5 20.7 39.6 39.6 3.3 9 4.2 25.5 1.8 35.7-5.2 22-22.7 40.4-45.1 47.1-4.3 1.3-9.3 1.8-17.5 1.8-10 0-12.6-.4-19.5-2.8-20.2-7-34.1-20.9-41.1-41.1-2.4-6.9-2.8-9.5-2.8-19.5 0-19.1 5.2-31.9 18.9-45.5 8.7-8.8 17.9-14.2 29-16.9 9.5-2.4 28.2-1.6 36.7 1.6z"/></svg>`
    const stopSVG = `<svg id="stopSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M232 1.1c-13.5 1.2-22.5 2.8-38 6.6-51.6 12.5-99.4 42.1-133.7 82.8-17.7 20.9-35.4 51.4-44.8 77C-2 215-4.6 268 8.1 318.2c10.7 42.6 32.7 81.8 64.1 114.4 40.5 41.9 89 67.2 146.9 76.6 11 1.8 17.6 2.2 36.9 2.2 26.8 0 38.6-1.3 62-7 43.3-10.6 83.7-33 116.4-64.4 32.5-31.2 58-75 69.1-118.5 20.3-79.5 3.5-158.9-47.3-224-8.3-10.6-35.4-37.1-46.5-45.4C358.1 13.5 294.6-4.8 232 1.1zm50.5 22c31.2 3.2 69.2 16.2 96 32.9 48 29.9 83.6 75.3 100.9 128.7 7.8 24.3 10.9 44.9 10.8 72.3-.1 51.9-15.8 98.7-47.5 140.8-8.3 11.2-29.8 33.3-40.5 41.6-42.9 33.7-92.1 50.8-146.2 50.8-37.6 0-69.1-7.2-102.5-23.6-48-23.6-84.8-60.4-108-108.1-16.4-33.5-23.6-64.7-23.6-101.8 0-28 3.4-49.6 11.8-74.7C45 147.9 64.2 116.9 90 91c20.1-20.2 38.2-33.2 63.5-45.6 40.1-19.7 82.7-27 129-22.3zM132.2 127.5c-6.6 2.9-6.3-4.4-6 130.5l.3 122 2.8 2.7 2.7 2.8h124 124l2.7-2.8 2.8-2.7.3-122.5c.3-136 .7-127.1-6.3-130.1-5.1-2.1-242.4-2-247.3.1z"/></svg>`
    const micSVG = `<svg id="micSVG" xmlns="http://www.w3.org/2000/svg" height="682px" viewBox="0 -960 960 960" width="682px"><path d="M480-420q-41.92 0-70.96-29.04Q380-478.08 380-520v-240q0-41.92 29.04-70.96Q438.08-860 480-860q41.92 0 70.96 29.04Q580-801.92 580-760v240q0 41.92-29.04 70.96Q521.92-420 480-420Zm0-220Zm-30 510v-131.85q-99-11.31-164.5-84.92Q220-420.39 220-520h60q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h60q0 99.61-65.5 173.23Q609-273.16 510-261.85V-130h-60Zm30-350q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/></svg>`
    /**
     * Loads a script from the specified source and executes the callback function when the script is loaded.
     *
     * @param {string} src - The URL of the script to load.
     * @param {function} callback - The function to execute when the script is loaded.
     * @return {void} This function does not return anything.
     */
    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }
    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js', () => {
        marked.setOptions({
            sanitizer: true,
            sanitize: true,
        });
        loadSettings();
        endpoints.forEach(endpoint => {
            if (endpoint.headers.includes('{')) {
                try {
                    endpoint.headers = endpoint.headers.replace(/'/g, '"');
                    const parsedHeaders = JSON.parse(endpoint.headers);
                    if (parsedHeaders.Authorization) {
                        const tempapiKey = parsedHeaders.Authorization.split(' ')[1];
                        if (tempapiKey) {
                            endpoint.headers = tempapiKey;
                        }
                    } else if (parsedHeaders['x-api-key']) {
                        const tempapiKey = parsedHeaders['x-api-key'];
                        if (tempapiKey) {
                            endpoint.headers = tempapiKey;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing endpoint header:', error);
                    endpoint.headers = '';
                }
            }
        });
        populateDropdown(modelIds);
        loadChatFromUrl();
        updateMessageCounters();
        saveSettings();
        updateMicButtonVisibility();
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js', () => {});
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js', () => {});
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js', () => {
        var script = document.createElement('script');
        script.innerHTML = 'pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";';
        document.head.appendChild(script);
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js', () => {});
    loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.88/dist/epub.min.js', () => {});
    let modelIds = []
    /**
     * Checks the status of the API by making a GET request to 'https://api.discord.rocks/models'.
     * If the request is successful, the function populates a dropdown menu with the model IDs
     * received from the response. If a favorite model is saved in the local storage, the dropdown
     * menus are updated with the saved favorite model.
     *
     * @return {Promise<void>} A promise that resolves when the API status is checked and the
     * dropdown menus are updated. If the request fails or times out, an error message is displayed.
     */
    function checkApiStatus() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        fetch('https://api.discord.rocks/models', {
            method: 'GET',
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error("API models returned error status:", response.status);
                document.getElementById('apiStatusMessage').style.display = 'block';
                return;
            } 
            return response.json();
        })
        .then(jsonData => {
            if (jsonData) {
                modelIds = jsonData.data.map(item => ({id: item.id, created: item.created}));
                populateDropdown(modelIds);
                const savedFavoriteModel = localStorage.getItem('favoriteModel');
                if (savedFavoriteModel) {
                    favoriteModelDropdown.value = savedFavoriteModel;
                    modelDropdown.value = savedFavoriteModel; 
                }
            }})
        .catch(e => {
            document.getElementById('apiStatusMessage').style.display = 'block';
            if (e.name === 'AbortError') {
                console.error('Fetch request timed out.');
                document.getElementById('apiStatusMessage').textContent = 'Request to api.discord.rocks timed out.'
            } else {
                console.error('Error fetching api.discord.rocks data:', e);
            }
        });
    }
    let freeModelsList = [];
    /**
     * Populates a dropdown menu with various models.
     *
     * @param {Array} modelIds - An array of objects containing model IDs and creation status.
     * @return {void} This function does not return a value.
     */
    function populateDropdown(modelIds, savePosition = false) {
        const lastPosition = modelDropdown.value;
        modelDropdown.innerHTML = `<option disabled>Popular models</option>
        <option value='llama-3-70b-chat'>llama-3-70b-chat (Free)</option>
        <option value='dall-e-3'>dall-e-3</option>`;
        const savedModels = localStorage.getItem('savedModels');
        if (savedModels) {
            const savedModelIds = JSON.parse(savedModels);
            savedModelIds.forEach(id => {
                const endpoint = endpoints.find(endpoint => endpoint.title === id);
                if (endpoint) {
                    endpoint.tested = true;
                }
            });
            localStorage.removeItem('savedModels');
            localStorage.setItem('endpoints', JSON.stringify(endpoints));
        }
        if (endpoints.some(endpoint => endpoint.tested)) {
            const savedmodelsOption = document.createElement('option');
            savedmodelsOption.textContent = 'Saved endpoints';
            savedmodelsOption.disabled = true;
            modelDropdown.appendChild(savedmodelsOption);
            endpoints
                .filter(endpoint => endpoint.tested)
                .sort((a, b) => a.title.localeCompare(b.title))
                .forEach(endpoint => {
                    const option = document.createElement('option');
                    const title = `${endpoint.title} - ${endpoint.model}`
                    option.value = title;
                    option.textContent = title;
                    modelDropdown.appendChild(option);
                });
        }
        const imageGeneration = document.createElement('option');
        imageGeneration.textContent = 'Image Generation';
        imageGeneration.disabled = true;
        modelDropdown.appendChild(imageGeneration);
        const dallE3 = document.createElement('option');
        dallE3.value = 'dall-e-3';
        dallE3.textContent = 'dall-e-3';
        modelDropdown.appendChild(dallE3);
        const freeModels = modelIds.filter(model => model.created === 0);
        const otherModels = modelIds.filter(model => model.created !== 0);
        const freeOption = document.createElement('option');
        freeOption.textContent = 'Free models';
        freeOption.disabled = true;
        modelDropdown.appendChild(freeOption);
        freeModelsList = [];
        freeModels.forEach(m => {
            freeModelsList.push(m.id);
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.id + ' (Free)';
            modelDropdown.appendChild(option);
        });
        const otherOption = document.createElement('option');
        otherOption.textContent = 'Other models';
        otherOption.disabled = true;
        modelDropdown.appendChild(otherOption);
        otherModels.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.id;
            modelDropdown.appendChild(option);
        });
        if (!savePosition) {
            modelDropdown.selectedIndex = 1
        } else {
            const modelDropdownOptions = Array.from(modelDropdown.options).map(option => option.value);
            if (modelDropdownOptions.includes(lastPosition)) {
                modelDropdown.value = lastPosition
            } else {
                modelDropdown.selectedIndex = 1
            }
        }
        const favoriteModel = localStorage.getItem('favoriteModel') || favoriteModelDropdown.value;
        favoriteModelDropdown.innerHTML = modelDropdown.innerHTML;
        const favoriteModelDropdownOptions = Array.from(favoriteModelDropdown.options).map(option => option.value);
        if (favoriteModelDropdownOptions.includes(favoriteModel)) {
            favoriteModelDropdown.value = favoriteModel;
        }
    }
    checkApiStatus();
    let abortController = new AbortController();
    const messageBox = document.getElementById('messageBox');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    messageBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (isMobile || event.shiftKey) {
                return;
            } else {
                event.preventDefault();
                sendAndReceiveMessage();
            }
        }
    });
    const fileContainer = document.getElementById('fileContainer');
    let attachedFiles = [];
    /**
     * Prevents the default behavior of an event and stops its propagation.
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        messageBox.addEventListener(eventName, preventDefaults, false);
    });
    /**
     * Sets the border style of the messageBox element to a dashed line with a color of #8f564c.
     */
    function highlight(e) {
        messageBox.style.border = '2px dashed #8f564c';
    }
    /**
     * Removes the highlight border from the messageBox element.
     */
    function unhighlight(e) {
        messageBox.style.border = '';
    }
    ['dragenter', 'dragover'].forEach(eventName => {
        messageBox.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        messageBox.addEventListener(eventName, unhighlight, false);
    });
    messageBox.addEventListener('drop', handleFileDrop, false);
    /**
     * Handles the drop event and processes the dropped files.
     */
    function handleFileDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
        adjustTextareaHeight(messageBox);
    }
    /**
     * Handles the files dropped or selected in the file input.
     *
     * @param {FileList} files - The list of files to handle.
     */
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!attachedFiles.some(attachedFile => attachedFile.name === file.name)) {
                const extension = file.name.split('.').pop().toLowerCase();
                if (['xls', 'xlsx', 'csv', 'docx', 'pdf', 'pptx', 'epub', 'rtf', 'mp3', 'm4a', 'webm'].includes(extension)) {
                    if (['mp3', 'm4a', 'webm'].includes(extension) && !checkValidityGroqToken(groqToken)) {
                        alert('To transcribe audios, please enter a valid Groq token.');
                    } else {
                        attachedFiles.push(file);
                        createFileBubble(file.name, fileContainer);
                        if (fileContainer.children.length > 0) {
                            fileContainer.style.display = 'flex';
                            fileContainer.style.marginBottom = '10px';
                        }
                    }
                } else {
                    const reader = new FileReader();
                    /**
                     * Handles the load event of the FileReader.
                     */
                    reader.onload = function(e) {
                        const arr = new Uint8Array(e.target.result);
                        const decoder = new TextDecoder('utf-8', { fatal: true });
                        try {
                            decoder.decode(arr);
                            attachedFiles.push(file);
                            createFileBubble(file.name, fileContainer);
                            if (fileContainer.children.length > 0) {
                                fileContainer.style.display = 'flex';
                                fileContainer.style.marginBottom = '10px';
                            }
                        } catch (e) {
                            alert(`File '${file.name}' is not a supported text, rtf, spreadsheet, docx, pptx, pdf, epub, mp3, m4a or webm file.`);
                            console.error(e);
                        }
                    };
                    /**
                     * Handles the error event of the FileReader. Displays an alert with an error message indicating the failure to read the file.
                     */
                    reader.onerror = function(e) {
                        alert(`Failed to read file: ${file.name}.\n${e.message}`);
                    };
                    reader.readAsArrayBuffer(file.slice(0, 100));
                }
            } else {
                alert(`File '${file.name}' is already attached.`);
            }
        }
    }
    /**
     * Parses a spreadsheet file and returns a promise that resolves with the markdown table representation of the first sheet of the parsed workbook.
     *
     * @param {File} file - The spreadsheet file to parse.
     * @return {Promise<string>} A promise that resolves with the markdown table representation of the first sheet of the parsed workbook.
     */
    function parseSpreadsheet(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Handles the onload event of the FileReader. Reads the file data, parses it as an XLSX workbook,
             * extracts the first sheet, converts it to a markdown table, and resolves the promise with the
             * resulting markdown table.
             *
             * @return {Promise<string>} A promise that resolves with the markdown table representation of the
             *                          first sheet of the parsed workbook.
             */
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = convertToMarkdownTable(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }));
                resolve(worksheet);
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Converts a 2D array of data into a markdown table.
     *
     * @param {Array<Array<any>>} data - The 2D array of data to be converted into a markdown table.
     * @return {string} The markdown table representation of the input data.
     */
    function convertToMarkdownTable(data) {
        if (data.length === 0) return '';
        const header = data[0];
        const headerRow = `| ${header.join(' | ')} |\n`;
        const separatorRow = `| ${header.map(() => '---').join(' | ')} |\n`;
        const contentRows = data.slice(1).map(row => `| ${row.join(' | ')} |\n`).join('');
        return headerRow + separatorRow + contentRows;
    }
    /**
     * Parses a DOCX file and returns the extracted text as a promise.
     *
     * @param {File} file - The DOCX file to be parsed.
     * @return {Promise<string>} A promise that resolves with the extracted text from the DOCX file. If the parsing fails, the promise is rejected with an error message.
     */
    function parseDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                mammoth.extractRawText({ arrayBuffer: event.target.result })
                    .then(result => {
                        resolve(result.value);
                    })
                    .catch(e => {
                        reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                    });
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses a PowerPoint file (.pptx) and extracts the text content from each slide.
     *
     * @param {File} file - The PowerPoint file to parse.
     * @return {Promise<string>} A promise that resolves with the concatenated text content of all slides in the file.
     */
    function parsePptx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Sets an event handler for the `load` event of the `reader` object.
             * When the event is triggered, it loads the contents of the ZIP file
             * asynchronously using JSZip library. It then extracts the text content
             * from each slide in the ZIP file and resolves the promise with the
             * concatenated text content. If there is an error parsing the slides or
             * loading the ZIP file, it rejects the promise with an appropriate error
             * message.
             *
             * @param {Event} event - The event object containing the loaded data.
             * @return {Promise<string>} A promise that resolves with the concatenated
             * text content of all slides in the ZIP file.
             */
            reader.onload = function(event) {
                const zip = new JSZip();
                zip.loadAsync(event.target.result)
                    .then(function(zip) {
                        const slidePromises = [];
                        zip.folder('ppt/slides').forEach((relativePath, file) => {
                            slidePromises.push(file.async('string'));
                        });
                        Promise.all(slidePromises).then(slides => {
                            let textContent = '';
                            slides.forEach(slide => {
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(slide, 'application/xml');
                                const texts = xmlDoc.getElementsByTagName('a:t');
                                for (let i = 0; i < texts.length; i++) {
                                    textContent += texts[i].textContent + '\n';
                                }
                            });
                            resolve(textContent.trim());
                        }).catch(e => {
                            reject(new Error(`Failed to parse slides: ${e.message}`));
                        });
                    }).catch(e => {
                        reject(new Error(`Failed to load ZIP: ${e.message}`));
                    });
            };
            /**
             * Sets an error handler for the FileReader.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses a PDF file and returns its trimmed text content.
     *
     * @param {File} file - The PDF file to be parsed.
     * @return {Promise<string>} A promise that resolves with the trimmed text content of the PDF file.
     * @throws {Error} If there is an error parsing the PDF file.
     */
    function parsePdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Asynchronously handles the load event of the FileReader by parsing a PDF file.
             *
             * @param {Event} event - The load event object.
             * @return {Promise<string>} A promise that resolves with the trimmed text content of the PDF file.
             * @throws {Error} If there is an error parsing the PDF file.
             */
            reader.onload = async function (event) {
                try {
                    const arrayBuffer = event.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const pdfDoc = await pdfjsLib.getDocument({data: uint8Array}).promise;
                    let textContent = '';
                    const numPages = pdfDoc.numPages;
                    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                        const page = await pdfDoc.getPage(pageNumber);
                        const textContentItems = (await page.getTextContent()).items;
                        const pageText = textContentItems.map(item => item.str).join('\n');
                        textContent += pageText + '\n\n';
                    }
                    resolve(textContent.trim());
                } catch (e) {
                    reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                }
            };
            /**
             * Sets an error handler for the FileReader.
             */
            reader.onerror = function (e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses the given EPUB file and extracts the text content of each chapter.
     *
     * @param {File} file - The EPUB file to be parsed.
     * @return {Promise<string>} A promise that resolves with the concatenated text content      of all chapters.
     * @throws {Error} If there is an error parsing the chapters or loading the EPUB file.
     */
    function parseEpub(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Handles the load event of the FileReader. Parses the loaded EPUB file and extracts the text content of each chapter.
             *
             * @param {Event} event - The load event object.
             * @return {Promise<string>} A promise that resolves with the concatenated text content of all chapters.
             * @throws {Error} If there is an error parsing the chapters or loading the EPUB file.
             */
            reader.onload = function(event) {
                const epub = ePub(event.target.result);
                epub.ready.then(() => {
                    const spineItems = epub.spine.spineItems;
                    const chaptersPromises = spineItems.map(item => {
                        return item.load(epub.load.bind(epub)).then(() => {
                            return item.render();
                        }).then(rendered => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(rendered, "text/html");
                            return doc.body.textContent.trim();
                        });
                    });
                    Promise.all(chaptersPromises).then(chapters => {
                        const textContent = chapters.join('\n\n');
                        resolve(textContent);
                    }).catch(e => {
                        reject(new Error(`Failed to parse chapters: ${e.message}`));
                    });
                }).catch(e => {
                    reject(new Error(`Failed to load EPUB: ${e.message}`));
                });
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses an RTF string and returns a parsed version with special characters replaced and unnecessary formatting removed.
     *
     * @param {string} rtf - The RTF string to parse.
     * @return {string} The parsed RTF string.
     */
    function parseRtf(rtf) {
        return rtf.replace(/\\par[d]?/g, '\n')
                  .replace(/\\'[0-9a-f]{2}/gi, (match) => String.fromCharCode(parseInt(match.slice(2), 16)))
                  .replace(/\\[a-z]+\d* ?/gi, '')
                  .replace(/[{\\}]/g, '')
                  .replace(/\n{2,}/g, '\n');
    }
    /**
     * Transcribes an audio file using the Groq API.
     *
     * @param {File} audioFile - The audio file to transcribe.
     * @return {Promise<string>} A promise that resolves with the transcribed text.
     * @throws {Error} If the Groq API key is invalid or missing.
     * @throws {Error} If the Groq API request fails.
     */
    function transcribeAudio(audioFile) {
        return new Promise((resolve, reject) => {
            if (!checkValidityGroqToken(groqToken)) {
                reject(new Error('Invalid or missing Groq API key.'));
                return;
            }
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', 'whisper-large-v3');
            formData.append('temperature', 0);
            formData.append('response_format', 'json');
            document.getElementById('bigSpinner').style.display = 'block';
            fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqToken.trim()}`
                },
                body: formData
            })
            .then(response => {
                document.getElementById('bigSpinner').style.display = 'none';
                if (!response.ok) {
                    throw new Error(`Groq API request failed: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                resolve(data.text); 
            })
            .catch(error => {
                document.getElementById('bigSpinner').style.display = 'none';
                reject(error);
            });
        });
    }
    /**
     * Truncates the given file name to a specified maximum length and appends an ellipsis if necessary.
     *
     * @param {string} fileName - The name of the file to truncate.
     * @param {number} [maxLength=8] - The maximum length of the truncated file name. Defaults to 8.
     * @return {string} The truncated file name.
     */
    function truncateFileName(fileName, maxLength = 8) {
        const [name, ext] = fileName.split('.');
        if (name.length <= maxLength) {
            return fileName;
        }
        return `${name.substring(0, maxLength)}...${ext}`;
    }
    /**
     * Creates a file bubble element and appends it to the given container.
     *
     * @param {string} filename - The name of the file.
     * @param {HTMLElement} container - The container element to which the file bubble will be appended.
     * @param {string} [content=null] - The content of the file. If not provided, the content will be fetched from the attachedFiles array.
     */
    function createFileBubble(filename, container, content = null) {
        const fileBubble = document.createElement('div');
        fileBubble.classList.add('file-bubble');
        const fileNameSpan = document.createElement('span');
        fileNameSpan.textContent = truncateFileName(filename);
        const isMessageBubble = container.classList.value.includes('message-content');
        if (!isMessageBubble) {
            const closeButton = document.createElement('button');
            closeButton.classList.add('close-btn');
            closeButton.addEventListener('click', (e) => {
               e.stopPropagation();
               removeFile(filename, fileBubble);
            });
            fileBubble.appendChild(closeButton);
        }
        fileBubble.appendChild(fileNameSpan);
        fileBubble.addEventListener('click', () => {
            if (content) {
                openModal(filename, content);
            } else {
                const file = attachedFiles.find(file => file.name === filename);
                if (file) {
                    getFileContent(file).then(fileContent => {
                        openModal(file.name, fileContent);
                    }).catch(e => {
                        console.error(`Failed to open file '${filename}': ${e.message}`);
                    })
                }
            }
        });
        messageBox.style.maxHeight = 'calc(30vh - 60px)';
        container.appendChild(fileBubble);
    }
    /**
     * Retrieves the content of a file based on its extension.
     *
     * @param {File} file - The file object to retrieve the content from.
     * @return {Promise<any>} A promise that resolves with the content of the file.
     */
    function getFileContent(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (['xls', 'xlsx', 'csv'].includes(extension)) {
            return parseSpreadsheet(file);
        } else if (extension === 'docx') {
            return parseDocx(file);
        } else if (extension === 'pdf') {
            return parsePdf(file);
        } else if (extension === 'pptx') {
            return parsePptx(file);
        } else if (extension === 'epub') {
            return parseEpub(file);
        } else if (extension === 'rtf') {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                /**
                 * Sets a success handler for the FileReader.
                 *
                 * @return {Promise<any>} A promise that resolves with the parsed RTF content.
                 */
                reader.onload = function(e) {
                    resolve(parseRtf(e.target.result));
                };
                /**
                 * Sets an error handler for the FileReader.
                 */
                reader.onerror = function(e) {
                    reject(e.message);
                };
                reader.readAsText(file);
            });
        } else if (['m4a', 'mp3', 'webm'].includes(extension)) {
            return transcribeAudio(file);
        } else {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                /**
                 * Sets a success handler for the reader.
                 *
                 * @return {Promise<any>} A promise that resolves with the result of the reader.
                 */
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                /**
                 * Sets an error handler for the reader.
                 */
                reader.onerror = function(e) {
                    reject(e.message);
                };
                reader.readAsText(file);
            });
        }
    }
   /**
     * Creates a modal dialog with the given title and content and appends it to the document body.
     *
     * @param {string} title - The title of the modal dialog.
     * @param {string} content - The content of the modal dialog.
     */
    function openModal(title, content) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalTitle = document.createElement('span');
        modalTitle.textContent = title;
        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.textContent = content;
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    /**
     * Removes a file from the file container and updates the attached files list.
     *
     * @param {string} fileName - The name of the file to be removed.
     * @param {HTMLElement} fileBubble - The HTML element representing the file bubble to be removed.
     */
    function removeFile(fileName, fileBubble) {
        fileContainer.removeChild(fileBubble);
        attachedFiles = attachedFiles.filter(file => file.name !== fileName);
        adjustTextareaHeight(messageBox);
        if (attachedFiles.length === 0) {
            fileContainer.style.display = 'none';
            fileContainer.style.marginBottom = '0';
        }
    }
    let pasteCount = 0;
    messageBox.addEventListener('paste', handlePasteEvent);
    /**
     * Handles the paste event by extracting text from the clipboard and creating a file from it.
     *
     * @param {Event} event - The paste event.
     */
    function handlePasteEvent(event) {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');
        if (pastedText && pastedText.length > 1500 && copyToFileEnabled) {
            event.preventDefault();
            const blob = new Blob([pastedText], { type: 'text/plain' });
            const file = new File([blob], `paste-${pasteCount}.txt`, { type: 'text/plain' });
            pasteCount++;
            handleFiles([file]);
            adjustTextareaHeight(messageBox);
        }
    }
    const attachButton = document.getElementById('attachButton');
    const fileInput = document.getElementById('fileInput');
    attachButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        handleFiles(files);
        adjustTextareaHeight(messageBox);
        fileInput.value = '';
    });
    let imageQuality = 'standard'; 
    let imageSize = '1024x1024';
    const sendButton = document.getElementById('sendButton');
    sendButton.innerHTML = sendSVG;
    const backButton = document.getElementById('backButton');
    backButton.innerHTML = backSVG;
    const addButton = document.getElementById('addButton');
    addButton.innerHTML = addSVG;
    const runButton = document.getElementById('runButton');
    runButton.innerHTML = runSVG;
    const micButton = document.getElementById('micButton');
    micButton.innerHTML = micSVG;
    /**
     * Updates the visibility of the micButton element based on the validity of the groqToken.
     */
    function updateMicButtonVisibility() {
        micButton.style.display = checkValidityGroqToken(groqToken) ? 'block' : 'none'; 
    }
    let mediaRecorder, audioChunks = [], recordingTimer;
    let isProcessingAudio = false;
    /**
     * Starts recording audio from the user's microphone.
     *
     * @return {Promise<void>} A promise that resolves when the recording starts successfully, or rejects with an error message if there was an issue accessing the microphone.
     */
    function startRecording() {
        const constraints = {
            audio: {
                sampleRate: 48000,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };
        isProcessingAudio = false;
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                const options = {
                    mimeType: 'audio/webm;codecs=opus',
                    audioBitsPerSecond: 128000
                };
                mediaRecorder = new MediaRecorder(stream, options);
                mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
                mediaRecorder.onstop = stopRecording;
                mediaRecorder.start();
                messageBox.style.display = 'none';
                micButton.innerHTML = stopSVG;
                runButton.style.display = 'none';
                addButton.style.display = 'none';
                sendButton.style.display = 'none';
                settingsButton.style.display = 'none';
                attachButton.style.display = 'none';
                startTimer();
            })
            .catch(error => {
                alert('Error accessing microphone: ' + error.message);
            });
    }
    /**
     * Stops the recording and processes the recorded audio.
     */
    function stopRecording() {
        if (isProcessingAudio) return; // Prevent multiple calls
        isProcessingAudio = true;
        clearInterval(recordingTimer);
        mediaRecorder.stop();
        // Use setTimeout to ensure all data has been processed
        setTimeout(() => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = [];
            messageBox.style.display = 'block';
            micButton.innerHTML = micSVG;
            runButton.style.display = '';
            addButton.style.display = '';
            settingsButton.style.display = '';
            sendButton.style.display = '';
            attachButton.style.display = '';

            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.remove();
            }
            processRecordedAudio(audioBlob);
            isProcessing = false;
        }, 1000); // Small delay to ensure all data is collected
    }
    /**
     * Processes recorded audio by checking its validity, attaching it to the file container, and displaying it.
     *
     * @param {Blob} audioBlob - The audio blob to be processed.
     */
    function processRecordedAudio(audioBlob) {
        if (audioBlob.size === 0) {
            console.warn('Empty audio blob detected. Skipping processing.');
            return;
        }
        const audioFile = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' });
        if (checkValidityGroqToken(groqToken)) {
            attachedFiles = attachedFiles.filter(file => file.name !== audioFile.name);
            attachedFiles.push(audioFile);
            while (fileContainer.firstChild) {
                fileContainer.removeChild(fileContainer.firstChild);
            }
            attachedFiles.forEach(file => createFileBubble(file.name, fileContainer));
            if (fileContainer.children.length > 0) {
                fileContainer.style.display = 'flex';
                fileContainer.style.marginBottom = '10px';
            } else {
            }
        } else {
            alert('Invalid or missing Groq API key. Audio rejected.');
        }
    }
    /**
     * Starts a timer that displays the elapsed time in minutes and seconds.
     * The timer is displayed in a div element with the id 'timer' in the '.message-form-buttons' element.
     * The timer updates every second and counts up from 0.
     *
     * @return {void} This function does not return a value.
     */
    function startTimer() {
        let seconds = 0;
        const timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.textContent = '00:00';
        document.querySelector('.message-form-buttons').appendChild(timerElement);
        recordingTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${pad(minutes)}:${pad(remainingSeconds)}`;
        }, 1000);
    }
    /**
     * A function that pads a number with a leading zero if it is less than 10.
     *
     * @param {number} num - The number to pad.
     * @return {string} The padded number as a string.
     */
    function pad(num) {
        return num < 10 ? `0${num}` : num;
    }
    micButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopRecording();
        } else {
            if (checkValidityGroqToken(groqToken)) {
                startRecording();
            } else {
                alert('Please enter a valid Groq API key in the settings.');
            }
        }
    });
    const infoLink = document.getElementById('info-link');
    const modelDropdown = document.getElementById('modelDropdown');
    const previousChats = document.querySelector('.previous-chats ul');
    modelDropdown.addEventListener('change', () => {
        const selectedModel = modelDropdown.value;
        const imageQualitySelector = document.getElementById('imageQualitySelector');
        const imageSizeSelector = document.getElementById('imageSizeSelector');
        if (selectedModel === 'dall-e-3') {
            if (!imageQualitySelector) {
                createImageQualitySelector();
            }
            if (!imageSizeSelector) {
                createImageSizeSelector();
            }
        } else {
            if (imageQualitySelector) {
                imageQualitySelector.remove();
            }
            if (imageSizeSelector) {
                imageSizeSelector.remove();
            }
        }
    });
    /**
     * Creates an image quality selector element and appends it to the model selector.
     */
    function createImageQualitySelector() {
        const imageQualitySelector = document.createElement('select');
        imageQualitySelector.id = 'imageQualitySelector';
        imageQualitySelector.innerHTML = `
            <option value="standard">Standard</option>
            <option value="hd">HD</option>
        `;
        imageQualitySelector.value = imageQuality;
        imageQualitySelector.addEventListener('change', () => {
            imageQuality = imageQualitySelector.value;
        });
        imageQualitySelector.selectedIndex = 0
        document.querySelector('.model-selector-right').appendChild(imageQualitySelector);
    }
    /**
     * Creates the image size selector element and appends it to the model selector.
     */
    function createImageSizeSelector() {
        const imageSizeSelector = document.createElement('select');
        imageSizeSelector.id = 'imageSizeSelector';
        imageSizeSelector.innerHTML = `
            <option value="1024x1024">1024x1024</option>
            <option value="1024x1792">1024x1792</option>
            <option value="1792x1024">1792x1024</option>
        `;
        imageSizeSelector.value = imageSize;
        imageSizeSelector.addEventListener('change', () => {
            imageSize = imageSizeSelector.value;
        });
        imageSizeSelector.selectedIndex = 0
        document.querySelector('.model-selector-right').appendChild(imageSizeSelector);
    }
    let conversationHistory = [];
    let currentChatIndex = -1;
    let isNewChat = true;
    loadChatHistory();
    adjustTextareaHeight(messageBox);
    addButton.addEventListener('click', () => addMessageToHistory(messageBox.value.trim()));
    runButton.addEventListener('click', run);
    sendButton.addEventListener('click', handleSendClick);
    backButton.addEventListener('click', () => {
        if (sendButton.innerHTML.includes('stop')) {
            abortMessageSending().then(setTimeout(endChatSession, 0));
        } else {
            endChatSession();
        }
    });
    infoLink.addEventListener('click', showInfo);
    /**
     * Displays information about the application and prompts the user to visit the Discord Rocks API website if confirmed.
     */
    function showInfo() {
        var message = 'Created by @pianoth, LLMs and domain provided by @meow_18838.\nPowered by the Discord Rocks API (https://api.discord.rocks/).\n\nDo you want to visit the Discord Rocks API website?';
        var result = confirm(message);
        if (result) {
            window.location.href = 'https://api.discord.rocks/';
        }
    }
    /**
     * Handles the click event of the send button by sending and receiving a message or generating an image.
     */
    function handleSendClick() {
        sendAndReceiveMessage();
    }
    /**
     * Handles the click event of the abort button by aborting the message sending process.
     */
    function handleAbortClick() {
        abortMessageSending();
    }
    /**
     * Runs the function to hide the previous chats, add an export button, handle sending a message,
     * change the text content of the send button to 'Abort', remove the event listener for handleSendClick,
     * add an event listener for handleAbortClick, display the back button, and change the class name of the send button to 'abort-button'.
     */
    function run() {
        document.querySelector('.previous-chats').style.display = 'none';
        addExportButton();
        handleSend();
        runButton.style.display = 'none'
        addButton.style.display = 'none'
        sendButton.innerHTML = stopSVG;
        sendButton.removeEventListener('click', handleSendClick);
        sendButton.addEventListener('click', handleAbortClick);
        backButton.style.display = 'block';
        sendButton.className = 'abort-button';
    }
    //Settings
    const settingsButton = document.getElementById('settingsButton');
    settingsButton.innerHTML = settingsSVG;
    const settingsModal = document.getElementById('settingsModal');
    const closeModalButton = settingsModal.querySelector('.close');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const saveSettingsButton2 = document.getElementById('saveSettingsButton2');
    const apiKeyInput = document.getElementById('apiKey');
    const groqTokenInput = document.getElementById('groqToken');
    const systemPromptInput = document.getElementById('systemPromptInput');
    const favoriteModelDropdown = document.getElementById('favoriteModelDropdown')
    const maxTokensInput = document.getElementById('maxTokensInput');
    const temperatureInput = document.getElementById('temperatureInput');
    const top_pInput = document.getElementById('top_pInput');
    const endpointsButton = document.getElementById('endpointsButton');
    const endpointsModal = document.getElementById('endpointsModal');
    const closeEndpointsModalButton = endpointsModal.querySelector('.close');
    const endpointsList = document.getElementById('endpointsList');
    const addEndpointButton = document.getElementById('addEndpointButton');
    const endpointSettingsModal = document.getElementById('endpointSettingsModal');
    const closeEndpointSettingsModalButton = endpointSettingsModal.querySelector('.close');
    const endpointTitleInput = document.getElementById('endpointTitle');
    const endpointUrlInput = document.getElementById('endpointUrl');
    const endpointHeadersInput = document.getElementById('endpointHeaders');
    const toggleApiKeyButton = document.getElementById('toggleApiKeyVisibility');
    const endpointOutputInput = document.getElementById('endpointOutput');
    const endpointStreamInput = document.getElementById('endpointStream');
    const saveEndpointSettingsButton = document.getElementById('saveEndpointSettingsButton');
    let endpoints = [
        {
            title: 'OpenAI',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: "YOUR_API_KEY",
            model: 'gpt-4o',
            output: 'choices[0].delta.content'
        },
        {
            title: 'Anthropic',
            url: 'https://api.anthropic.com/v1/messages',
            headers: "YOUR_API_KEY",
            model: 'claude-3-opus-20240229',
            output: 'delta.text'
        }
    ];
    toggleApiKeyButton.addEventListener('click', () => {
        if (endpointHeadersInput.type === 'password') {
            endpointHeadersInput.type = 'text';
            toggleApiKeyButton.textContent = 'Hide';
        } else {
            endpointHeadersInput.type = 'password';
            toggleApiKeyButton.textContent = 'Show';
        }
    });
    systemPromptInput.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    temperatureInput.addEventListener('input', function() {
        if (this.value > 2) {
            alert('Temperature cannot exceed 2.');
            this.value = 2;
        } else if (this.value < 0) {
            alert('Temperature cannot be less than 0.');
            this.value = 0;
        }
    });
    top_pInput.addEventListener('input', function() {
        if (this.value > 2) {
            alert('Top_p cannot exceed 2.');
            this.value = 2;
        } else if (this.value < 0) {
            alert('Top_p cannot be less than 0.');
            this.value = 0;
        }
    });
    settingsButton.addEventListener('click', function() {
        maxTokensInput.value = max_tokens;
        temperatureInput.value = temperature;
        top_pInput.value = top_p;
        settingsModal.style.display = '';
    });
    closeModalButton.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    let copyToFileEnabled = true;
    /**
     * Loads the settings from the local storage and updates the corresponding UI elements.
     */
    function loadSettings() {
        const savedCopyToFileEnabled = localStorage.getItem('copyToFileEnabled');
        if (savedCopyToFileEnabled !== null) {
            copyToFileEnabled = JSON.parse(savedCopyToFileEnabled);
            document.getElementById('copyToFileToggle').checked = copyToFileEnabled;
        }
        const webSearchToggle = localStorage.getItem('webSearch');
        if (webSearchToggle !== null) {
            document.querySelector('input[name="webSearch"][value="' + webSearchToggle + '"]').checked = true;
        }
        const savedEndpoints = localStorage.getItem('endpoints');
        if (savedEndpoints !== null) {
            endpoints = JSON.parse(savedEndpoints);
        }
        apiKey = localStorage.getItem('apiKey');
        if (apiKey !== null) {
            apiKeyInput.value = apiKey;
        }
        groqToken = localStorage.getItem('groqToken');
        if (groqToken !== null) {
            groqTokenInput.value = groqToken.trim();
        }
    }
    /**
     * Checks the validity of a Groq token.
     *
     * @param {string} groqT - The Groq token to check.
     * @return {boolean} Returns true if the token is valid, false otherwise.
     */
    function checkValidityGroqToken(groqT) {
        return groqT.startsWith('gsk_') && groqT.length > 40;
    }
    /**
     * Saves the current settings to the local storage.
     */
    function saveSettings() {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('groqToken', groqToken);
        localStorage.setItem('copyToFileEnabled', JSON.stringify(copyToFileEnabled));
        localStorage.setItem('webSearch', document.querySelector('input[name="webSearch"]:checked').value);
        localStorage.setItem('endpoints', JSON.stringify(endpoints));
        localStorage.setItem('favoriteModel', favoriteModelDropdown.value);
    }
    /**
     * Saves the current settings and updates the UI accordingly.
     */
    function saveSettingsButtonEvent() {
        apiKey = apiKeyInput.value.trim();
        groqToken = groqTokenInput.value.trim();
        if (!checkValidityGroqToken(groqToken) && groqToken != '') alert('Invalid Groq Token!');
        copyToFileEnabled = document.getElementById('copyToFileToggle').checked;
        saveSettings();
        max_tokens = parseInt(maxTokensInput.value) || 4096;
        temperature = parseFloat(temperatureInput.value) || 1;
        top_p = parseFloat(top_pInput.value) || 1;
        settingsModal.style.display = 'none';
        updateMicButtonVisibility();
    }
    saveSettingsButton.addEventListener('click', saveSettingsButtonEvent);
    saveSettingsButton2.addEventListener('click', saveSettingsButtonEvent);
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    messageBox.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    let allowRetry = true;
    endpointsButton.addEventListener('click', () => {
        loadEndpoints();
        endpointsModal.style.display = 'flex';
    });
    closeEndpointsModalButton.addEventListener('click', () => {
        endpointsModal.style.display = 'none';
    });
    addEndpointButton.addEventListener('click', () => {
        endpoints.push({ title: 'Enter the endpoint title here', url: 'Enter the endpoint URL here', headers: "", model: 'Enter the model name here', output: 'choices[0].message.content', stream: true});
        saveSettings();
        loadEndpoints();
        openEndpointSettings(endpoints.length - 1);
    });
    /**
     * Loads the endpoints and populates the endpoints list.
     */
    function loadEndpoints() {
        endpointsList.innerHTML = '';
        const uniqueEndpoints = Array.from(new Set(endpoints.map(endpoint => `${endpoint.title} - ${endpoint.url}`)))
            .map(endpointString => endpointString.split(' - '));
        uniqueEndpoints.forEach(([title, url]) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = title;
            li.appendChild(span);
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            const testButton = document.createElement('button');
            testButton.textContent = 'Test';
            testButton.className = 'test';
            testButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const spinner = document.createElement('span');
                spinner.className = 'loading-spinner';
                testButton.appendChild(spinner);
                testButton.disabled = true;
                const endpointsToTest = endpoints.filter(e => e.title === title && e.url === url);
                testEndpointsSequentially(endpointsToTest)
                    .then(() => {
                        alert(`All test requests for endpoint '${title}' were successful!`);
                    })
                    .catch(e => {
                        const failedModels = endpointsToTest.filter(endpoint => !endpoint.tested).map(endpoint => endpoint.model);
                        alert(`Test requests for endpoint '${title}' failed for the following model: ${failedModels.join(', ')}`);
                    })
                    .finally(() => {
                        testButton.removeChild(spinner);
                        testButton.disabled = false;
                    });
            });
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Are you sure you want to delete this endpoint?')) {
                    endpoints = endpoints.filter(e => e.title !== title || e.url !== url);
                    populateDropdown(modelIds, true);
                    saveSettings();
                    loadEndpoints();
                }
            });
            buttonGroup.appendChild(testButton);
            buttonGroup.appendChild(deleteButton);
            li.appendChild(buttonGroup);
            li.addEventListener('click', () => openEndpointSettings(endpoints.findIndex(e => e.title === title && e.url === url)));
            endpointsList.appendChild(li);
        });
    }
    const showAdvancedSettingsButton = document.getElementById('showAdvancedSettingsButton')
    showAdvancedSettingsButton.addEventListener('click', showAdvancedSettings);
    /**
     * Shows the advanced settings by updating the style and content of the showAdvancedSettingsButton,
     * displaying the advancedSettings element, and updating the event listeners for the button.
     */
    function showAdvancedSettings() {
        showAdvancedSettingsButton.style.marginBottom = '10px';
        showAdvancedSettingsButton.textContent = 'Hide Advanced';
        document.getElementById('advancedSettings').style.display = '';
        showAdvancedSettingsButton.removeEventListener('click', showAdvancedSettings);
        showAdvancedSettingsButton.addEventListener('click', hideAdvancedSettings);
    }
    /**
     * Hides the advanced settings by updating the text content and margin bottom of the showAdvancedSettingsButton,
     * hiding the advancedSettings element, and updating the event listeners for the button.
     */
    function hideAdvancedSettings() {
        showAdvancedSettingsButton.textContent = 'Show Advanced';
        showAdvancedSettingsButton.style.marginBottom = '0';
        document.getElementById('advancedSettings').style.display = 'none';
        showAdvancedSettingsButton.removeEventListener('click', hideAdvancedSettings);
        showAdvancedSettingsButton.addEventListener('click', showAdvancedSettings);
    }
    /**
     * Opens the endpoint settings modal and populates the inputs with the values of the endpoint at the given index.
     *
     * @param {number} index - The index of the endpoint in the endpoints array.
     */
    function openEndpointSettings(index) {
        const endpoint = endpoints[index];
        endpointTitleInput.value = endpoint.title;
        endpointUrlInput.value = endpoint.url;
        endpointHeadersInput.value = endpoint.headers;
        const modelList = endpointSettingsModal.querySelector('.model-list');
        modelList.innerHTML = ''
        const matchingEndpoints = endpoints.filter(e => e.url === endpoint.url);
        /**
         * Adds a model to the list by creating a new list item with an input field,
         * a test button, and a delete button. The test button triggers a testEndpoint
         * function with the given model. The delete button removes the list item from
         * the list.
         *
         * @param {HTMLElement} list - The list element to which the new item will be added.
         * @param {string} model - The model to be added to the list.
         */
        function addModelToList(list, model) {
            const li = document.createElement('li');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = model;
            const testButton = document.createElement('button');
            testButton.textContent = 'Test';
            testButton.className = 'test'
            testButton.addEventListener('click', () => {
                const spinner = document.createElement('span');
                spinner.className = 'loading-spinner';
                testButton.appendChild(spinner);
                testButton.disabled = true;
                const endpointToTest = {
                    title: endpointTitleInput.value,
                    url: endpointUrlInput.value,
                    headers: endpointHeadersInput.value,
                    model: input.value,
                    output: endpointOutputInput.value,
                    stream: endpointStreamInput.checked
                };
                testEndpoint(endpointToTest)
                    .then(([url, output, gemini]) => {
                        alert(`Test request for model '${model}' was successful!`);
                    })
                    .catch(e => {
                        alert(`Test request for model '${model}' failed! ${e.message}`);
                    })
                    .finally(() => {
                        testButton.removeChild(spinner);
                        testButton.disabled = false;
                    });
            });
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                list.removeChild(li);
            });
            li.appendChild(input);
            li.appendChild(testButton);
            li.appendChild(deleteButton);
            list.appendChild(li);
        }
        matchingEndpoints.forEach(endpoint => {
            addModelToList(modelList, endpoint.model);
        });
        const addModelButton = document.getElementById('addModelButton');
        if (!addModelButton.hasOwnProperty('_hasClickHandler')) {
            function clickHandler() {
                addModelToList(document.querySelector('#endpointSettingsModal .model-list'), '');
            }
            addModelButton.addEventListener('click', clickHandler);
            addModelButton._hasClickHandler = true;
        }
        endpointOutputInput.value = endpoint.output;
        endpointStreamInput.checked = endpoint.stream !== undefined ? endpoint.stream : true;
        endpointSettingsModal.style.display = 'flex';
        /**
         * Handles the click event for the save endpoint settings button.
         * Validates the input fields, updates the endpoints array, and tests the endpoints if necessary.
         * Finally, updates the UI and saves the settings.
         */
        saveEndpointSettingsButton.onclick = () => {
            const modelInputs = modelList.querySelectorAll('input');
            const newModels = Array.from(modelInputs).map(input => input.value.trim());
            if (newModels.length !== new Set(newModels).size) {
                alert('Model names must be unique.');
                return;
            }
            let existingMatchingEndpoints = endpoints.filter(e => e.url === endpoint.url);
            if (endpoint.url !== endpointUrlInput.value) {
                existingMatchingEndpoints.forEach(e => {
                    endpoints.splice(endpoints.indexOf(e), 1);
                });
                existingMatchingEndpoints = endpoints.filter(e => e.url === endpointUrlInput.value);
                if (existingMatchingEndpoints.length > 0) {
                    alert('Endpoint URL must be unique.');
                    return;
                }
            }
            const removedModels = existingMatchingEndpoints.filter(e => !newModels.includes(e.model));
            removedModels.forEach(modelToRemove => {
                endpoints.splice(endpoints.indexOf(modelToRemove), 1);
            });
            const addedModels = newModels.filter(newModel => !existingMatchingEndpoints.some(e => e.model === newModel));
            addedModels.forEach(modelToAdd => {
                endpoints.push({
                    title: endpointTitleInput.value,
                    url: endpointUrlInput.value,
                    headers: endpointHeadersInput.value,
                    model: modelToAdd,
                    output: endpointOutputInput.value,
                    stream: endpointStreamInput.checked,
                    gemini: false
                });
            });
            if (endpoint.title !== endpointTitleInput.value) {
                if (endpoint.headers !== endpointHeadersInput.value) {
                    endpoints.filter(e => e.url === endpointUrlInput.value).forEach(e => { 
                        e.title = endpointTitleInput.value;
                        e.headers = endpointHeadersInput.value;
                        e.tested = false;
                    });
                } else {
                    endpoints.filter(e => e.url === endpointUrlInput.value).forEach(e => { 
                        e.title = endpointTitleInput.value;
                    });
                }
            } else if (endpoint.headers !== endpointHeadersInput.value) {
                endpoints.filter(e => e.url === endpointUrlInput.value).forEach(e => {
                    e.headers = endpointHeadersInput.value;
                    e.tested = false;
                });
            }
            const endpointsToBeTested = endpoints.filter(e => e.url === endpointUrlInput.value && e.title === endpointTitleInput.value && newModels.includes(e.model) && !e.tested)
            if (endpointsToBeTested.length > 0) {
                const spinner = document.createElement('span');
                spinner.className = 'loading-spinner';
                saveEndpointSettingsButton.appendChild(spinner);
                saveEndpointSettingsButton.disabled = true;
                testEndpointsSequentially(endpointsToBeTested)
                    .then(() => {
                        alert(`All test requests to the endpoint were successful! Models were added to the list of models.`);
                    })
                    .catch(e => {
                        const failedModels = endpointsToBeTested.filter(endpoint => !endpoint.tested).map(endpoint => endpoint.model);
                        alert(`Test requests for endpoint '${endpointTitleInput.value}' failed for the following model(s): ${failedModels.join(', ')}`);
                    })
                    .finally(() => {
                        populateDropdown(modelIds, true);
                        saveSettings();
                        loadEndpoints();
                        endpointSettingsModal.style.display = 'none';
                        saveEndpointSettingsButton.removeChild(spinner);
                        saveEndpointSettingsButton.disabled = false;
                    });
            } else {
                populateDropdown(modelIds, true);
                saveSettings();
                loadEndpoints();
                endpointSettingsModal.style.display = 'none';
            }
        }
    }
    /**
     * Tests multiple endpoints sequentially.
     *
     * @param {Array<Object>} endpoints - An array of endpoint objects to test.
     * @return {Promise<void>} A promise that resolves when all endpoints have been tested successfully, or rejects if any endpoint test fails.
     */
    function testEndpointsSequentially(endpoints) {
        return endpoints.reduce((promise, endpoint) => {
            return promise.then(() => {
                return testEndpoint(endpoint)
                    .then(([url, output, gemini]) => {
                        endpoint.url = url;
                        endpoint.output = output;
                        endpoint.gemini = gemini;
                        endpoint.tested = true;
                    });
            });
        }, Promise.resolve());
    }
    /**
     * Tests an endpoint by sending a POST request to the specified URL with the provided headers and body.
     * If the endpoint is streaming, it reads the response and tries to auto-detect the output path.
     * If the endpoint is not streaming, it checks the output path specified in the endpoint object.
     *
     * @param {Object} endpoint - The endpoint object containing the URL, headers, model, messages, max_tokens, and stream properties.
     * @return {Promise<[string, string]>} A promise that resolves with an array containing the tested URL and the output path.
     * @throws {Error} If the response is not OK or if the output path cannot be determined.
     */
    function testEndpoint(endpoint) {
        let headers = {}
        if (!endpoint.headers) {
            headers = {'Content-Type': 'application/json'}
        } else {
            headers = {'Authorization': `Bearer ${endpoint.headers}`, 'x-api-key': endpoint.headers,'Content-Type': 'application/json','anthropic-version': '2023-06-01'}
        }
        let body = {
            model: endpoint.model,
            messages: [{ role: 'user', content: 'Hello, world' }],
            max_tokens: 10,
            stream: endpoint.stream 
        };
        if (endpoint.gemini) {
            body = {
                model: endpoint.model,
                ...convertOpenAIToGemini(body.messages),
                generation_config: {
                    maxOutputTokens: 10
                }
            }
        }
        body = JSON.stringify(body)
        return new Promise((resolve, reject) => {
            /**
             * Tests the output of a given data object based on whether the endpoint is streaming or not.
             * If the endpoint is streaming, it tries to auto-detect the output path from the data events.
             * If the endpoint is not streaming, it checks the output path specified in the endpoint object.
             *
             * @param {Object} data - The data object to test the output from.
             * @param {boolean} isStreaming - Indicates whether the endpoint is streaming or not.
             * @return {Promise<string>} A promise that resolves with the output path if successful, or rejects with an error if the output path cannot be determined.
             */
            function testOutput(data, isStreaming) {
                return new Promise((res, rej) => {
                    if (isStreaming) {
                        const events = data;
                        const possiblePaths = [
                            'choices[0].delta.content',
                            'content[0].delta.text',
                            'choices[0].text',
                            'content',
                            'delta.content',
                            'delta.text',
                            'text'
                        ];
                        for (const path of possiblePaths) {
                            for (const event of events) {
                                const dataMatch = event.match(/data:\s*({.+?})\s*$/);
                                if (dataMatch) {
                                    try {
                                        const jsonData = JSON.parse(dataMatch[1]);
                                        let output = extractData(jsonData, path);
                                        if (typeof output === 'string' && output.trim() !== '') {
                                            return res(path);
                                        }
                                    } catch (e) {
                                        console.error(e)
                                    }
                                }
                            }
                        }
                        rej(new Error('Failed to auto-detect output path for streaming response.'));
                    } else {
                        try {
                            let output = extractData(data, endpoint.output);
                            if (typeof output !== 'string') {
                                throw new Error(`Output is not a string: ${typeof output}`);
                            }
                            if (output.trim() === '') {
                                throw new Error('Output is empty');
                            }
                            res(endpoint.output);
                        } catch (e) {
                            const commonPaths = {
                                'choices[0].message.content': data?.choices?.[0]?.message?.content,
                                'content[0].text': data?.content?.[0]?.text,
                                'response': data?.response,
                                'text': data?.text,
                                'choices[0].message': data?.choices?.[0]?.message,
                                'candidates[0].content.parts[0].text': data?.candidates?.[0]?.content?.parts?.[0]?.text
                            };
                            for (const [key, value] of Object.entries(commonPaths)) {
                                if (typeof value === 'string') {
                                    return res(key);
                                }
                            }
                            rej(new Error(`Invalid output path: ${e.message}`));
                        }
                    }
                });
            }
            /**
             * Checks the response from a fetch request and throws an error if the response is not OK.
             * If the response is streaming, it reads the response and tries to auto-detect the output path.
             * If the response is not streaming, it checks the content type of the response and returns the output data.
             *
             * @param {Response} response - The response object from a fetch request.
             * @return {Promise<[string, string]> | void} - A promise that resolves with an array containing the tested URL and the output path, or void if the response is not streaming.
             * @throws {Error} - Throws an error if the response is not OK or if the response is not JSON.
             */
            function checkResponse(response) {
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
                if (endpoint.stream) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let events = [];
                    let buffer = '';
                    return reader.read().then(function processText({ done, value }) {
                        if (done) {
                            return testOutput(events, true);
                        }
                        const text = decoder.decode(value, { stream: true });
                        buffer += text;
                        events = events.concat(buffer.split('\n\n'));
                        buffer = events.pop();
                        return reader.read().then(processText);
                    });
                } else {
                    if (response.headers.get('content-type')?.includes('application/json')) {
                        return response.json().then(data => testOutput(data, false));
                    }
                    throw new Error('The response is not JSON');
                }
            }
            fetch(endpoint.url.trim(), { method: 'POST', headers, body })
                .then(checkResponse)
                .then((outputPath) => resolve([endpoint.url.trim(), outputPath, false]))
                .catch((e) => {
                    const bypassCORSUrl = `https://cloudflare-cors-anywhere.queakchannel42.workers.dev/?${endpoint.url.trim()}`;
                    fetch(bypassCORSUrl, { method: 'POST', headers, body })
                        .then(checkResponse)
                        .then((outputPath) => resolve([bypassCORSUrl, outputPath, false]))
                        .catch((e) => {
                            if (endpoint.gemini) {return reject(e)}
                            body = JSON.stringify({
                                model: endpoint.model,
                                ...convertOpenAIToGemini(JSON.parse(body).messages),
                                generation_config: {
                                    maxOutputTokens: 10
                                }
                            })
                            fetch(endpoint.url.trim(), { method: 'POST', headers, body })
                                .then(checkResponse)
                                .then((outputPath) => resolve([endpoint.url.trim(), outputPath, true]))
                                .catch((e) => {
                                    const bypassCORSUrl = `https://cloudflare-cors-anywhere.queakchannel42.workers.dev/?${endpoint.url.trim()}`;
                                    fetch(bypassCORSUrl, { method: 'POST', headers, body })
                                        .then(checkResponse)
                                        .then((outputPath) => resolve([bypassCORSUrl, outputPath, true]))
                                        .catch((e) => reject(e));
                                });
                        });
                });
        });
    };
    closeEndpointSettingsModalButton.addEventListener('click', () => {
        endpointSettingsModal.style.display = 'none';
    });
    /**
     * Extracts data from a JSON object based on a given path string.
     *
     * @param {Object} data - The JSON object to extract data from.
     * @param {string} path - The path string indicating the location of the desired data.
     * @return {*} The extracted data, or undefined if the path does not exist.
     */
    function extractData(data, path) {
        const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
        return keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data);
    }
    /**
     * Adds a message to the conversation history.
     *
     * @param {string} messageContent - The content of the message.
     * @param {string} [role='user'] - The role of the message sender. Defaults to 'user'.
     * @return {Promise<void>} A promise that resolves when the message is added to the history.
     */
    function addMessageToHistory(messageContent, role = 'user') {
        return new Promise((resolve, reject) => {
            backButton.style.display = 'block';
            if (attachedFiles.length > 0) {
                let filesText = '';
                const filePromises = attachedFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const extension = file.name.split('.').pop().toLowerCase();
                        if (['xls', 'xlsx', 'csv'].includes(extension)) {
                            parseSpreadsheet(file).then(fileContent => {
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'docx') {
                            parseDocx(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'pdf') {
                            parsePdf(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'pptx') {
                            parsePptx(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'epub') {
                            parseEpub(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'rtf') {
                            const reader = new FileReader();
                            /**
                             * Handles the load event of the FileReader.
                             *
                             * @return {Promise<void>} A promise that resolves when the file content is processed and added to the filesText variable.
                             */
                            reader.onload = function(e) {
                                const rtfContent = e.target.result;
                                const plainText = parseRtf(rtfContent);
                                filesText += `\n${file.name}\n\`\`\`\n${plainText}\n\`\`\`\n`;
                                resolve();
                            };
                            /**
                             * Handles the error event of the FileReader.
                             */
                            reader.onerror = function(e) {
                                reject(new Error(`Failed to read file: ${file.name}.\n${e.message}`));
                            };
                            reader.readAsText(file);
                        } else if (['mp3', 'm4a', 'webm'].includes(extension)) {
                            transcribeAudio(file).then(fileContent => {
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            })
                        } else {
                            const reader = new FileReader();
                            /**
                             * Handles the load event of the FileReader.
                             */
                            reader.onload = function(e) {
                                let fileContent = e.target.result;
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            };
                            /**
                             * Handles the error event of the FileReader.
                             */
                            reader.onerror = function(e) {
                                reject(new Error(`Failed to read file: ${file.name}.\n${e.message}`));
                            };
                            reader.readAsText(file);
                        }
                    });
                });
                Promise.all(filePromises).then(() => {
                    pasteCount = 0;
                    messageContent += filesText;
                    attachedFiles = [];
                    fileContainer.style.display = 'none';
                    fileContainer.innerHTML = '';
                    conversationHistory.push({ role: role, content: messageContent });
                    messageBox.value = '';
                    adjustTextareaHeight(messageBox);
                    document.querySelector('.previous-chats').style.display = 'none';
                    addExportButton();
                    displayMessage(messageContent, role);
                    saveChatToHistory();
                    resolve();
                }).catch(e => {
                    console.error(e);
                    addMessageToHistory("Failed to read attached files.", "assistant");
                    reject(e);
                });
            } else {
                conversationHistory.push({ role: role, content: messageContent });
                messageBox.value = '';
                adjustTextareaHeight(messageBox);
                document.querySelector('.previous-chats').style.display = 'none';
                addExportButton();
                displayMessage(messageContent, role);
                saveChatToHistory();
                resolve();
            }
        });
    }
/**
     * Fetches a chat title based on the provided message content using the LLaMA 8B model.
     *
     * @param {string} messageContent - The content of the message to generate the chat title from.
     * @param {number} chatIndex - The index of the chat.
     * @return {Promise<string>} A promise that resolves with the generated chat title.
     *                           Rejects if there is an error fetching the chat title.
     */
    function fetchChatTitle(messageContent, chatIndex) {
        return new Promise((resolve, reject) => {
            const listItem = previousChats.children[previousChats.children.length - 1 - chatIndex];
            const generateButton = listItem.querySelector('button[title="Generate a new title for the chat."]');
            if (generateButton.querySelector('.loading-spinner')) {
                return;
            }
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            generateButton.appendChild(spinner);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const requestBody = {
                messages: [
                {
                    role: 'user',
                    content: `Your task is to generate a title for the following conversation:\n\n<conversation>\n${messageContent}\n</conversation>\n\nThe title should concisely summarize the main topic or key points of the conversation in a catchy and engaging way.\n\nUse plain text for the title with no markdown formatting.\n\nDo not include any text before or after the title, and only output one title.\n\nMake sure your title is short and concise.\n\nOutput your title between \` characters, like this: \`example title\``,
                },
                ],
                max_tokens: 40,
                temperature: 0.5
            };
            if (checkValidityGroqToken(groqToken)) {
                requestBody.model = 'llama-3.1-8b-instant';
                fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqToken.trim()}`
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                }).then(response => {
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch chat title: ${response.statusText}`);
                    }
                }).then(data => {
                    let title = data.choices[0].message.content.trim();
                    if (title && title.startsWith('`') && title.endsWith('`')) {
                        title = title.slice(1, -1);
                        if (title.startsWith('"') && title.endsWith('"')) {
                            title = title.slice(1, -1);
                        }
                        updateChatTitle(title, chatIndex);
                        resolve(title);
                    } else {
                        throw new Error('Invalid title response');
                    }
                }).catch(e => {
                    generateButton.removeChild(spinner);
                    if (e.name === 'AbortError') {
                        console.error('Fetch request for the chat title timed out.');
                    } else {
                        console.error('Error fetching chat title:', e);
                    }
                    reject(e);
                })
            } else {
                console.error('Invalid GROQ token:', groqToken);
                requestBody.model = 'llama-3.1-8b-turbo';
                fetch('https://api.discord.rocks/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                }).then(response => {
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch chat title: ${response.statusText}`);
                    }
                }).then(data => {
                    let title = data.choices[0].message.content.trim();
                    if (title && title.startsWith('`') && title.endsWith('`')) {
                        title = title.slice(1, -1);
                        if (title.startsWith('"') && title.endsWith('"')) {
                            title = title.slice(1, -1);
                        }
                        updateChatTitle(title, chatIndex);
                        resolve(title);
                    } else {
                        throw new Error('Invalid title response');
                    }
                }).catch(e => {
                    generateButton.removeChild(spinner);
                    if (e.name === 'AbortError') {
                        console.error('Fetch request for the chat title timed out.');
                    } else {
                        console.error('Error fetching chat title:', e);
                    }
                    reject(e);
                })
            }
        });
    }
    /**
     * Updates the title of the chat at the specified index in the chat history stored in the local storage.
     *
     * @param {string} newTitle - The new title for the chat.
     * @param {number} chatIndex - The index of the chat in the chat history.
     */
    function updateChatTitle(newTitle, chatIndex) {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        if (chatIndex < chats.length) {
            chats[chatIndex].title = newTitle;
            localStorage.setItem('chats', JSON.stringify(chats));
            updateChatListUI();
        } else {
            console.error('Invalid chat index:', chatIndex);
        }
    }
    /**
     * Fetches a web search query based on a conversation message content.
     *
     * @param {string} messageContent - The content of the conversation message.
     * @param {boolean} [auto=false] - Whether to automatically determine if a web search is needed.
     * @return {Promise<string>} A promise that resolves to the generated search query.
     */
    function fetchAutoWebSearchQuery(messageContent, auto = false) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const today = new Date().toDateString();
            let prompt = `Here is a conversation from the user:\n<conversation>\n${JSON.stringify(messageContent)}\n</conversation>\n`;
            prompt += auto
            ? `Please carefully analyze the conversation to determine if a web search is needed in order for you to provide an appropriate response to the latest message.\n\nIf you don't think you need to do a web search in order to respond, just reply with a very short message saying "NO".\n\nIf you believe a search is necessary, generate a search query that you would enter into the DuckDuckGo search engine to find the most relevant information to help you respond.\n\n`
            : `Your task is to generate a search query that you would enter into the DuckDuckGo search engine to find information that could help respond to the user's message. Do not attempt to directly answer the message yourself. Instead, focus on creating a search query that would surface the most relevant information from DuckDuckGo.\n\n`;
            prompt += `Keep it simple and short. Output your search query between \` characters, like this: \`example search query\`\n\nRespond with plain text only. Do not use any markdown formatting, and do not specify a site unless asked by the user. Do not include any text before or after the search query.\n\nRemember, today's date is ${today}. Keep this date in mind to provide time-relevant context in your search query if needed.\n\nFocus on generating the single most relevant search query you can think of to address the user's message. Do not provide multiple queries.`;
            const requestBody = {
                messages: [
                {
                    role: 'user',
                    content: prompt,
                },
                ],
                max_tokens: 40,
                temperature: 0.5
            };
            if (checkValidityGroqToken(groqToken)) {
                requestBody.model = 'llama-3.1-8b-instant';
                fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqToken.trim()}`
                    },
                    body: JSON.stringify(requestBody),
                    signal: abortController.signal
                }).then(response => {
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch chat title: ${response.statusText}`);
                    }
                }).then(data => {
                    let searchQuery = data.choices[0].message.content.trim();
                    if (searchQuery && searchQuery.startsWith('`') && searchQuery.endsWith('`')) {
                        searchQuery = searchQuery.slice(1, -1);
                        if (searchQuery.startsWith('"') && searchQuery.endsWith('"')) {
                            searchQuery = searchQuery.slice(1, -1);
                        }
                        resolve(searchQuery)
                    } else {
                        resolve(searchQuery)
                    }
                }).catch(e => {
                    if (e.name === 'AbortError') {
                        reject(new Error('Request aborted'));
                    } else {
                        console.error('Error fetching web search query:', e);
                        reject(e);
                    }
                });
            } else {
                requestBody.model = 'llama-3.1-8b-turbo';
                fetch('https://api.discord.rocks/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                }).then(response => {
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch chat title: ${response.statusText}`);
                    }
                }).then(data => {
                    let searchQuery = data.choices[0].message.content.trim();
                    if (searchQuery && searchQuery.startsWith('`') && searchQuery.endsWith('`')) {
                        searchQuery = searchQuery.slice(1, -1);
                        if (searchQuery.startsWith('"') && searchQuery.endsWith('"')) {
                            searchQuery = searchQuery.slice(1, -1);
                        }
                        resolve(searchQuery)
                    } else {
                        resolve(searchQuery)
                    }
                }).catch(e => {
                    if (e.name === 'AbortError') {
                        reject(new Error('Request aborted'));
                    } else {
                        console.error('Error fetching web search query:', e);
                        reject(e);
                    }
                });
            }
        });
    }
    /**
     * Fetches search results from DuckDuckGo based on the provided query.
     *
     * @param {string} query - The search query.
     * @return {Promise<Array<Array<string>>|string>} A promise that resolves with an array of formatted search results
     *                                                  or 'No search results found' if none are found. Each result is
     *                                                  represented as an array containing the title, URL, and snippet.
     */
    function fetchSearchResults(query) {        
        return new Promise((resolve, reject) => {
            fetch(`https://cloudflare-cors-anywhere.queakchannel42.workers.dev/?https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {signal: abortController.signal})
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const searchResults = doc.querySelectorAll('.result');
                    if (searchResults.length > 0) {
                        const topResults = Array.from(searchResults).slice(0, 7);
                        const formattedResults = topResults.map(result => {
                            const title = result.querySelector('.result__title .result__a').textContent;
                            const url = decodeURIComponent(result.querySelector('.result__title .result__a').href.match(/[?&]uddg=([^&]+)/)[1]);
                            const snippet = result.querySelector('.result__snippet').textContent;
                            return [title,url,snippet];
                        });
                        resolve(formattedResults);
                    } else {
                        resolve('No search results found');
                    }
                })
                .catch(e => {
                    if (e.name === 'AbortError') {
                        reject(new Error('Search aborted.'));
                    } else {
                        console.error('Error fetching search results:', e);
                        reject(e);
                    }
                });
        });
    }
    /**
     * Sends a message and receives a response from the server.
     *
     * @return {Promise<void>} A promise that resolves when the message is sent and a response is received.
     *                         Rejects if there is an error processing the files.
     */
    function sendAndReceiveMessage() {
        let messageContent = messageBox.value.trim();
        if (messageContent || attachedFiles.length > 0) {
            addMessageToHistory(messageContent, 'user')
                .then(() => {
                    if (isNewChat) {
                        let chats = JSON.parse(localStorage.getItem('chats')) || [];
                        fetchChatTitle(messageContent, chats.length - 1);
                        isNewChat = false;
                    }
                    handleSend();
                    runButton.style.display = 'none'
                    addButton.style.display = 'none'
                    sendButton.innerHTML = stopSVG;
                    sendButton.removeEventListener('click', handleSendClick);
                    sendButton.addEventListener('click', handleAbortClick);
                    sendButton.className = 'abort-button';
                })
                .catch(e => {
                    console.error('Error processing files:', e);
                    addMessageToHistory('Failed to read attached files.', 'assistant');
                });
        }
    }
    /**
     * Converts an OpenAI format conversation history to Gemini format.
     *
     * @param {Array} openAIFormat - The OpenAI format message history to convert.
     * @return {Object} geminiFormat - The converted Gemini format history.
     */
    function convertOpenAIToGemini(openAIFormat) {
        const geminiFormat = { contents: [] };
        openAIFormat.forEach(entry => {
            const geminiEntry = {
                role: (entry.role === 'assistant' || entry.role === 'system') ? 'model' : entry.role,
                parts: (entry.role === 'system') ? [{ text: '<SYSTEM MESSAGE>\n\n' + entry.content + '\n\n</SYSTEM MESSAGE>'}] : [{ text: entry.content }]
            };
            geminiFormat.contents.push(geminiEntry);
        });
        return geminiFormat;
    }
    /**
     * Sends a message to the server to generate an image.
     */
    function handleSendImage() {
        const messageContent = conversationHistory[conversationHistory.length - 1].content
        if (messageContent) {
            const selectedModel = modelDropdown.value;
            const requestBody = `{"prompt":"${messageContent}","model":"${selectedModel}","n":1,"quality":"${imageQuality}","response format":"url","size":"${imageSize}"}`
            if (!apiKey) {apiKey = 'missing api key'}
            const loadingMessage = displayMessage('Generating image...', 'loading');
            let retries = 0;
            const maxRetries = 2;
            allowRetry = true
            function tryFetch() {
                abortController = new AbortController();
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('Image generation request timed out.'));
                    }, 120000);
                });
                Promise.race([fetch('https://api.discord.rocks/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey.trim()}`
                        },
                        body: requestBody,
                        signal: abortController.signal
                    }),
                    timeoutPromise
                ])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Image generation request failed: ${response.error}`);
                    }
                    return response.json();
                })
                .then(data => {
                    backButton.disabled = true;
                    if (data.data && data.data.length > 0 && data.data[0].url) {
                        const imageUrl = data.data[0].url;
                        document.getElementById('messageContainer').removeChild(loadingMessage)
                        addMessageToHistory(imageUrl, 'assistant');
                        updateMessageCounters();
                        revertSendButton();
                        backButton.disabled = false;
                    } else {
                        throw new Error('Invalid image generation response.');
                    }
                })
                .catch(e => {
                    if (e.name === 'AbortError') {
                        allowRetry = false;
                    } else {
                        console.error('Error:', e);
                    }
                    if (retries < maxRetries && allowRetry) {
                        retries++;
                        loadingMessage.textContent = `Retrying (${retries}/${maxRetries})...`;
                        setTimeout(tryFetch, 1000);
                    } else {
                        backButton.disabled = false;
                        conversationHistory.pop();
                        revertSendButton();
                        if (allowRetry) {
                            loadingMessage.textContent = 'Failed to generate image after multiple retries.';
                            loadingMessage.className = 'error-message';
                        } else {
                            loadingMessage.parentNode.removeChild(loadingMessage);
                        }
                        saveChatToHistory();
                    }
                });
            }
            tryFetch();
        }
    }
    /**
     * Handles sending a message by fetching a web search query if necessary and updating the UI.
     *
     * @return {Promise<void>} A promise that resolves when the message is sent and the UI is updated.
     */
    function handleSend() {
        if (modelDropdown.value === 'dall-e-3') {
            handleSendImage();
        } else {
            const webSearchToggle = document.querySelector('input[name="webSearch"]:checked').value;
            if (webSearchToggle === 'on') {
                const loadingMessage = displayMessage('Thinking...', 'loading');
                abortController = new AbortController();
                fetchAutoWebSearchQuery(conversationHistory)
                    .then(searchQuery => {
                        handleSendMessageWithSearch(loadingMessage, searchQuery)
                    })
                    .catch(e => {
                        document.getElementById('messageContainer').removeChild(loadingMessage)
                        if (e.message !== 'Request aborted') handleSendMessage();
                    });
            } else if (webSearchToggle === 'off') {
                handleSendMessage();
            } else {
                const loadingMessage = displayMessage('Thinking...', 'loading');
                abortController = new AbortController();
                fetchAutoWebSearchQuery(conversationHistory, true)
                    .then(searchQuery => {
                        if (!searchQuery) {
                            document.getElementById('messageContainer').removeChild(loadingMessage)
                            handleSendMessage();
                        } else {
                            handleSendMessageWithSearch(loadingMessage, searchQuery)
                        }
                    })
                    .catch(e => {
                        document.getElementById('messageContainer').removeChild(loadingMessage)
                        if (e.message !== 'Request aborted') handleSendMessage();
                    });
            }
        }
    }
    /**
     * Handles sending a message with a search query by fetching search results from the server and updating the UI.
     *
     * @param {HTMLElement} loadingMessage - The loading message element to update with the search query.
     * @param {string} searchQuery - The search query to fetch results for.
     * @return {Promise<void>} A promise that resolves when the search results are fetched and the UI is updated.
     */
    function handleSendMessageWithSearch(loadingMessage, searchQuery) {
        loadingMessage.textContent = 'Searching for `' + searchQuery + '`...'
        fetchSearchResults(searchQuery)
            .then(searchResults => {
                const searchInfo = 'This message prompted a DuckDuckGo search query: `' + searchQuery + '`. Use these results in your answer. The results are:\n\n' + searchResults.map((result, i) => `${i + 1}. [${result[0]}](${result[1]})\n${result[2]}\n\n`).join('') + `\n\nTo quote the results you can use this format: [1].\n\nIf you need to quote multiple results, do not group multiple quotes together, but rather quote each result separately, like this: [1], [2].\n\nThe links will be automatically filled, you don't have to include them if you use this format.`;
                const selectedModel = modelDropdown.value;
                const systemMessage = document.getElementById('systemPromptInput').value.trim();
                const body = { messages: systemMessage ? [...conversationHistory.slice(0, -1), { role: 'system', content: systemMessage }, ...conversationHistory.slice(-1), { role: 'system', content: searchInfo }] : [...conversationHistory, { role: 'system', content: searchInfo }], model: selectedModel, max_tokens, temperature, top_p, stream: true }
                document.getElementById('messageContainer').removeChild(loadingMessage)
                handleSendMessage(body, searchResults.map((result, i) => `[${i + 1}]: ${result[1]}`).join('\n') + '\n')
            })
            .catch(e => {
                console.error('Error in search:', e);
                document.getElementById('messageContainer').removeChild(loadingMessage)
                if (e.message !== 'Search aborted.') handleSendMessage()
            });
    }
    /**
     * Handles sending a message by fetching data from the server and updating the UI.
     */
    function handleSendMessage(body = null, quotes = null) {
        const selectedModel = modelDropdown.value;
        const systemMessage = document.getElementById('systemPromptInput').value.trim();
        const requestBody = !body ? { messages: systemMessage ? [...conversationHistory.slice(0, -1), { role: 'system', content: systemMessage }, ...conversationHistory.slice(-1)] : conversationHistory, model: selectedModel, max_tokens, temperature, top_p, stream: true } : body
        const endpoint = endpoints.find(endpoint => `${endpoint.title} - ${endpoint.model}` === selectedModel);
        if (endpoint) {
            let headers = {}
            if (!endpoint.headers) {
                headers = {'Content-Type': 'application/json'}
            } else {
                headers = {'Authorization': `Bearer ${endpoint.headers}`, 'x-api-key': endpoint.headers,'Content-Type': 'application/json','anthropic-version': '2023-06-01'}
            }
            requestBody.model = endpoint.model
            if (endpoint.stream) {
                fetchEndpointStream(requestBody, quotes, endpoint.url, headers, endpoint.output, endpoint.gemini)
            } else {
                delete requestBody.stream
                fetchEndpointNonStream(requestBody, quotes, endpoint.url, headers, endpoint.output, endpoint.gemini)
            }
        } else {
            if (!apiKey) {apiKey = 'missing api key'}
            fetchEndpointStream(requestBody, quotes, 'https://api.discord.rocks/chat/completions', { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey.trim()}` }, 'choices[0].delta.content');
        }
    }
    /**
     * Fetches data from an endpoint using a stream.
     *
     * @param {Object} requestBody - The request body.
     * @param {string} quotes - The quotes.
     * @param {string} url - The URL of the endpoint.
     * @param {Object} headers - The headers.
     * @param {string} path - The path to extract data from the response.
     * @param {boolean} [geminiFormat=false] - Whether to use Gemini format.
     * @return {Promise} A promise that resolves when the data is fetched.
     */
    function fetchEndpointStream(requestBody, quotes, url, headers, path, geminiFormat = false) {
        if (geminiFormat) {
            requestBody = {
                model: requestBody.model,
                ...convertOpenAIToGemini(requestBody.messages),
                generation_config: {
                    temperature,
                    topP: requestBody.top_p,
                    maxOutputTokens: requestBody.max_tokens
                }
            }
        }
        const loadingMessage = displayMessage('Loading...', 'loading');
        let retries = 0;
        const maxRetries = 2;
        let allContent = quotes || '';
        let buffer = '';
        function tryFetch() {
            abortController = new AbortController();
            fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
                signal: abortController.signal
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request to ${url} failed: ${response.statusText}`);
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                loadingMessage.innerHTML = ''
                const textSpan = document.createElement('span');
                textSpan.classList.add('message-content');
                loadingMessage.appendChild(textSpan);
                /**
                * Processes the text received from the reader.
                *
                * @param {Object} options - The options object.
                * @param {boolean} options.done - Indicates if the reading is done.
                * @param {ArrayBuffer} options.value - The value received from the reader.
                */
                function processText({ done, value }) {
                    if (done) {
                        backButton.disabled = true
                        document.getElementById('messageContainer').removeChild(loadingMessage);
                        if (allContent.trim() === '') {
                            allContent = 'No response from the API.';
                        }
                        displayMessage(allContent.trim(), 'assistant');
                        conversationHistory.push({ role: 'assistant', content: allContent.trim() });
                        saveChatToHistory();
                        updateMessageCounters();
                        revertSendButton();
                        backButton.disabled = false;
                        return;
                    }
                    const text = decoder.decode(value, { stream: true });
                    buffer += text;
                    let events = buffer.split('\n\n');
                    buffer = events.pop();
                    events.forEach(event => {
                        try {
                            const dataMatch = event.match(/data:\s*({.+?})\s*$/);
                            if (dataMatch) {
                                const jsonData = dataMatch[1];
                                if (jsonData === '[DONE]') {
                                    return;
                                }
                                const eventData = JSON.parse(jsonData);
                                let output = extractData(eventData, path);
                                if (output) {
                                    allContent += output;
                                    parseMarkdownToHTML(textSpan, allContent);
                                    loadingMessage.className = 'assistant-message';
                                }
                            }
                        } catch (e) {
                            console.error('Failed to parse event:', e, 'Event:', event);
                        }
                    });
                    reader.read().then(processText).catch(catchError);
                }
                function catchError(e) {
                    if (e.name === 'AbortError') {
                        document.getElementById('messageContainer').removeChild(loadingMessage);
                        conversationHistory.pop();
                        if (allContent.trim()) {
                            addMessageToHistory(allContent.trim(), 'assistant');
                            saveChatToHistory();
                            updateMessageCounters();
                        }
                    } else {
                        console.error('Error:', e);
                        saveChatToHistory();
                    }
                }
                reader.read().then(processText).catch(catchError);
            })
            .catch(e => {
                if (e.name === 'AbortError') {
                    allowRetry = false;
                } else {
                    console.error('Error:', e);
                }
                if (retries < maxRetries && allowRetry) {
                    retries++;
                    loadingMessage.textContent = `Retrying (${retries}/${maxRetries})...`;
                    setTimeout(tryFetch, 1000);
                } else {
                    backButton.disabled = false;
                    conversationHistory.pop();
                    revertSendButton();
                    if (allowRetry) {
                        loadingMessage.textContent = 'Failed to load response after multiple retries.';
                        loadingMessage.className = 'error-message';
                    } else {
                        loadingMessage.parentNode.removeChild(loadingMessage);
                        if (allContent.trim()) {
                            addMessageToHistory(allContent.trim(), 'assistant');
                        }
                    }
                    saveChatToHistory();
                }
            });
        }
        tryFetch();
    }
    /**
     * Fetches data from an endpoint and stores the response in a string.
     *
     * @param {Object} requestBody - The request body.
     * @param {string} quotes - Optional quotes.
     * @param {string} url - The URL of the endpoint.
     * @param {Object} headers - The headers for the request.
     * @param {string} path - The path to extract data from the response.
     * @param {boolean} [geminiFormat=false] - Whether to convert the request body to Gemini format.
     */
    function fetchEndpointNonStream(requestBody, quotes, url, headers, path, geminiFormat = false) {
        if (geminiFormat) {
            requestBody = {
                model: requestBody.model,
                ...convertOpenAIToGemini(requestBody.messages),
                generation_config: {
                    temperature,
                    topP: requestBody.top_p,
                    maxOutputTokens: requestBody.max_tokens
                }
            }
        }
        const loadingMessage = displayMessage('Loading...', 'loading');
        let retries = 0;
        const maxRetries = 2;
        let allContent = quotes || '';
        function tryFetch() {
            abortController = new AbortController();
            fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
                signal: abortController.signal
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request to ${url} failed: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                backButton.disabled = true
                let output = extractData(data, path);
                if (typeof output !== 'string') {
                    throw new Error(`Output is not a string: ${typeof output}`);
                }
                allContent += output;
                document.getElementById('messageContainer').removeChild(loadingMessage);
                if (allContent.trim() === '') {
                    allContent = 'No response from the API.';
                }
                displayMessage(allContent.trim(), 'assistant');
                conversationHistory.push({ role: 'assistant', content: allContent.trim() });
                saveChatToHistory();
                updateMessageCounters();
                revertSendButton();
                backButton.disabled = false;
            })
            .catch(e => {
                if (e.name === 'AbortError') {
                    allowRetry = false;
                } else {
                    console.error('Error:', e);
                }
                if (retries < maxRetries && allowRetry) {
                    retries++;
                    loadingMessage.textContent = `Retrying (${retries}/${maxRetries})...`;
                    setTimeout(tryFetch, 1000);
                } else {
                    backButton.disabled = false;
                    conversationHistory.pop();
                    revertSendButton();
                    if (allowRetry) {
                        loadingMessage.textContent = 'Failed to load response after multiple retries.';
                        loadingMessage.className = 'error-message';
                    } else {
                        loadingMessage.parentNode.removeChild(loadingMessage);
                        if (allContent.trim()) {
                            addMessageToHistory(allContent.trim(), 'assistant');
                        }
                    }
                    saveChatToHistory();
                }
            });
        }
        tryFetch();
    }
    /**
     * Reverts the send button to its original state by setting the text content to 'Send Message',
     * removing the event listener for 'click' that triggers handleAbortClick, adding an event listener
     * for 'click' that triggers handleSendClick, and resetting the className to an empty string.
     *
     * @return {void} This function does not return anything.
     */
    function revertSendButton() {
        sendButton.innerHTML = sendSVG;
        addButton.style.display = ''
        runButton.style.display = ''
        sendButton.removeEventListener('click', handleAbortClick);
        sendButton.addEventListener('click', handleSendClick);
        sendButton.className = '';
    }    
    /**
     * Aborts the current message sending process, saves the chat to history, adds the last message to the conversation history,
     * aborts the current request, creates a new AbortController, and reverts the send button.
     *
     * @return {Promise<void>} A promise that resolves when the abort process is complete.
     */
    function abortMessageSending() {
        return new Promise(resolve => {
            saveChatToHistory();
            conversationHistory.push(conversationHistory.slice(-1)[0]);
            abortController.abort();
            abortController = new AbortController();
            revertSendButton();
            backButton.disabled = false;
            resolve();
        });
    }
    /**
     * Adjusts the height of a textarea element based on its content.
     *
     * @param {HTMLTextAreaElement} textarea - The textarea element to adjust.
     */
    function adjustTextareaHeight(textarea) {
        textarea.style.height = '51px';
        textarea.style.paddingTop = '17.6px'
        textarea.style.height = textarea.scrollHeight + 'px';
        const maxTextBoxHeight = attachedFiles.length > 0 ? 'calc(30vh - 60px)' : '30vh';
        textarea.style.maxHeight = maxTextBoxHeight;
        if (document.getElementById('messageBoxContainer').contains(textarea)) {
            textarea.style.paddingLeft = `${attachButton.offsetWidth + 15}px`;
        }
    }
    /**
     * Checks if the given text contains basic Markdown syntax.
     *
     * @param {string} text - The text to check for Markdown syntax.
     * @return {boolean} Returns true if the text contains Markdown syntax, false otherwise.
     */
    function containsMarkdown(text) {
        const markdownPattern = /[#*_\[\]`!]/;
        return markdownPattern.test(text);
    }
    /**
     * Checks if the given text contains basic LaTeX syntax.
     *
     * @param {string} text - The text to check for LaTeX syntax.
     * @return {boolean} Returns true if the text contains LaTeX syntax, false otherwise.
     */
    function containsLaTeX(text) {
        const latexPattern = /\\[a-zA-Z([]+/;
        return latexPattern.test(text);
    }
    /**
     * Parses Markdown text and renders it as HTML, handling LaTeX syntax if present.
     *
     * @param {HTMLElement} textSpan - The HTML element to render the parsed text into.
     * @param {string} message - The Markdown text to parse and render.
     */
    function parseMarkdownToHTML(textSpan, message) {
        if (containsLaTeX(message)) {
            const inlinePattern = /\\\(.*?\\\)/g;
            const displayPattern = /\\\[[\s\S]*?\\\]/g;
            let counter = 0;
            const formulas = [];
            const placeholders = [];
            /**
             * Replaces a matched string with a placeholder and adds the match and placeholder to the formulas array.
             *
             * @param {string} match - The matched string.
             * @param {string} p1 - The first capturing group of the matched string.
             * @param {number} offset - The offset of the matched string in the input string.
             * @param {string} string - The input string.
             * @return {string} The placeholder string.
             */
            const replaceFunc = (match, p1, offset, string) => {
                let placeholder = `$$$$$MATH$${counter++}$$$$$`;
                formulas.push({match, placeholder});
                return placeholder;
            };
            message = message.replace(inlinePattern, replaceFunc);
            message = message.replace(displayPattern, replaceFunc);
            formulas.forEach(formula => {
                try {
                    const html = katex.renderToString(formula.match.slice(2, -2), {
                        throwOnError: false,
                        displayMode: formula.match.startsWith('\\[')
                    });
                    placeholders.push({placeholder: formula.placeholder, html});
                } catch (e) {
                    console.error('KaTeX rendering error:', e);
                }
            });
            let parsedText = marked.parse(message)
            placeholders.forEach(ph => {
                parsedText = parsedText.replace(ph.placeholder, ph.html);
            });
            textSpan.innerHTML = parsedText.replace(/(?<!<\/?\w+>)\n(?!\s*<\/?\w+>)/g, '<br>');
        } else if (containsMarkdown(message)) {
            textSpan.innerHTML = marked.parse(message).replace(/(?<!<\/?\w+>)\n(?!\s*<\/?\w+>)/g, '<br>');
        } else {
            textSpan.innerHTML = message.replace(/\n/g, '<br>');
            return;
        }
        const preElements = textSpan.querySelectorAll('pre');
        preElements.forEach(pre => {
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Code';
            copyButton.className = 'copy-code-button';
            /**
             * Copies the code text from the <pre> element to the clipboard when the copy button is clicked.
             *
             * @return {Promise<void>} A promise that resolves when the code is successfully copied to the clipboard.
             *                         If an error occurs during the copying process, it is logged to the console.
             */
            copyButton.onclick = function() {
                const codeText = pre.innerText.slice(0, -11);
                navigator.clipboard.writeText(codeText)
                    .then(() => alert('Code copied to clipboard!'))
                    .catch(e => console.error('Failed to copy code: ', e));
            };
            pre.appendChild(copyButton);
        });
    }
    /**
     * Parses the given message and displays it as files as bubbles if it contains files,
     * otherwise it parses the message as Markdown and displays it as HTML, or displays the image if it's an image URL.
     *
     * @param {HTMLElement} textSpan - The element to display the parsed message in.
     * @param {string} message - The message to parse and display.
     * @param {boolean} [user=true] - Whether the message is from the user.
     * @param {HTMLElement} messageDiv - The message div element.
     */
    function parseMessage(textSpan, message, user = true, messageDiv) {
        if (containsFiles(message) && user) {
            displayFilesAsBubbles(textSpan, message);
        } else if (message.startsWith("https://dalleprodaue.blob.core.windows.net/private/images/")) {
            displayImage(message, messageDiv);
        } else {
            parseMarkdownToHTML(textSpan, message);
        }
    }
    /**
     * Calculates the total length of all quoted sections in a message string.
     *
     * @param {string} message - The message string containing quotes.
     * @returns {number} The total length of all quoted sections.
     */
    function calculateQuoteLength(message) {
        const quotePattern = /^\[\d+\]:\s+https?:\/\/\S+\s*/gm;
        let match;
        let totalQuoteLength = 0;
        while ((match = quotePattern.exec(message)) !== null) {
            totalQuoteLength += match[0].length;
        }
        return totalQuoteLength;
    }
    /**
     * Attaches event listeners to the given buttons and selects elements to handle user interactions.
     *
     * @param {HTMLElement} editButton - The button element for editing a message.
     * @param {HTMLElement} deleteButton - The button element for deleting a message.
     * @param {HTMLElement} copyButton - The button element for copying a message.
     * @param {HTMLElement} roleSelect - The select element for selecting a role.
     * @param {HTMLElement} textSpan - The element containing the message text.
     * @param {HTMLElement} messageDiv     - The div element containing the message.
     * @param {string} message - The message text.
     * @param {HTMLElement} buttonsDiv - The div element containing the buttons.
     */
    function attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, message, buttonsDiv) {
        const MAX_LENGTH = 1000 + calculateQuoteLength(message);
        const user = messageDiv.className === 'user-message';
        if (message.length > MAX_LENGTH) {
            const partialMessage = message.substring(0, MAX_LENGTH) + '...';
            parseMessage(textSpan, partialMessage, user, messageDiv);
            const showMoreButton = document.createElement('button');
            showMoreButton.textContent = 'Show More';
            showMoreButton.className = 'show-more-button';
            showMoreButton.title = 'Show the full content of this message.';
            showMoreButton.setAttribute('aria-describedby', 'showMoreButtonDesc');
            messageDiv.appendChild(showMoreButton);
            /**
             * Handles the click event of the showMoreButton element. Toggles between showing the full message and a partial message.
             */
            showMoreButton.onclick = function() {
                if (showMoreButton.textContent === 'Show More') {
                    parseMessage(textSpan, message, user, messageDiv);
                    showMoreButton.textContent = 'Show Less';
                    showMoreButton.title = 'Collapse the content of this message.';
                    showMoreButton.setAttribute('aria-describedby', 'showLessButtonDesc');
                } else {
                    parseMessage(textSpan, partialMessage, user, messageDiv);
                    showMoreButton.textContent = 'Show More';
                    showMoreButton.title = 'Show the full content of this message.';
                    showMoreButton.setAttribute('aria-describedby', 'showMoreButtonDesc');
                }
            };
        } else {
            parseMessage(textSpan, message, user, messageDiv);
        }
        /**
         * Handles the change event of the roleSelect element. Updates the role of the corresponding message in the
         * conversation history.
         */
        roleSelect.addEventListener('change', () => {
            const newRole = roleSelect.value;
            const currentIndex = parseInt(messageDiv.id.split('-')[1]);
            if (currentIndex === -1) return;
            abortController.abort();
            abortController = new AbortController();
            conversationHistory[currentIndex].role = newRole;
            saveChatToHistory();
            messageDiv.className = `${newRole}-message`;
        });
        /**
         * Handles the click event of the edit button. Aborts the current request, retrieves the current message index,
         * creates a textarea element with the value of the corresponding message in the conversation history, adjusts the
         * height of the textarea, and adds event listeners to adjust the height of the textarea on input. Creates confirm
         * and cancel buttons, replaces the text span with the textarea, clears the buttons div, and appends the confirm
         * and cancel buttons. If the confirm button is clicked, updates the content of the corresponding message in the
         * conversation history, parses the message, replaces the textarea with the text span, clears the buttons div,
         * appends the edit, delete, and copy buttons, saves the chat to history, and attaches listeners to the buttons.
         * If the cancel button is clicked, replaces the textarea with the text span, clears the buttons div, appends the
         * edit, delete, and copy buttons, and appends the show more button if it exists.
         */
        editButton.onclick = function() {
            allowRetry = false;
            abortController.abort();
            let currentIndex = parseInt(messageDiv.id.split('-')[1]);
            if (currentIndex === -1) return;
            const input = document.createElement('textarea');
            input.style.width = '100%';
            input.value = conversationHistory[currentIndex].content;
            setTimeout(() => {adjustTextareaHeight(input)}, 0);
            input.addEventListener('input', function() {
                adjustTextareaHeight(this);
            });
            const confirmButton = document.createElement('button');
            confirmButton.innerHTML = `<svg id="confirmSVG" xmlns="http://www.w3.org/2000/svg" width="682.667" height="682.667" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet"><path d="M234 13.6c-1.9.2-8.2 1.1-14 2-97.3 14.5-177.1 87.6-200.3 183.5-5.2 21.1-6.2 30.7-6.2 56.9 0 31.2 2.4 47.3 11.1 74.2 24.1 74.7 82.5 133 157.2 157.2 27.3 8.8 43 11.1 75.2 11 22.9-.1 27-.3 40-2.7 51.7-9.3 97.5-33.5 133-70.3 36.2-37.4 57.9-81.1 66.7-133.9 2.5-15.6 2.5-55.4 0-71-9.3-56-33.5-102.3-73.4-140.5-29-27.8-64.1-47.7-102.8-58.4-21.8-6-35-7.8-60.5-8.1-12.4-.2-24.1-.1-26 .1zM275.1 58c72.8 7.4 135.7 53.6 163.9 120.4 10.9 25.7 15.4 48.4 15.4 77.6 0 29.4-4.6 52.5-15.6 78.1-40.3 93.7-144.1 141.8-241.4 111.9-72.3-22.2-125.5-83.7-138-159.6-2.5-15.1-2.5-45.7 0-60.8 7-42.4 26.3-80.3 56.1-110.1 42-42 101.3-63.4 159.6-57.5zm90.4 98.5L361 158c-.2 0-33.2 32.7-73.2 72.7L215 303.5l-31.8-31.7c-17.4-17.4-33.3-32.4-35.2-33.4-2.1-1-5.7-1.7-9-1.7-15.9 0-26.7 16.6-20.1 30.8 1.3 2.7 15.7 17.7 43.7 45.6 44.5 44.1 44.2 43.9 53.5 43.9 8.6 0 9.3-.6 95-86.6 87.7-88.1 83.9-83.8 83.9-94-.1-7.2-5.2-15.4-12-18.9-4.6-2.4-12.7-2.8-17.5-1z"/></svg>`;
            confirmButton.className = 'confirm-button';
            confirmButton.title = 'Confirm the changes.';
            confirmButton.setAttribute('aria-describedby', 'confirmButtonDesc');
            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = cancelSVG;
            cancelButton.className = 'cancel-button';
            cancelButton.title = 'Cancel the changes.';
            cancelButton.setAttribute('aria-describedby', 'cancelButtonDesc');
            messageDiv.replaceChild(input, textSpan);
            buttonsDiv.innerHTML = '';
            const showMoreButton = messageDiv.querySelector('.show-more-button');
            let showMoreButtonExists = showMoreButton !== null;
            if (showMoreButtonExists) {
                messageDiv.removeChild(showMoreButton);
            }
            buttonsDiv.appendChild(confirmButton);
            buttonsDiv.appendChild(cancelButton);
            /**
             * Handles the click event of the confirm button. Updates the content of the corresponding message in the conversation history,
             * parses the message, replaces the text span with the textarea, clears the buttons div, and appends the edit, delete, and copy buttons.
             * If the message does not exist in the conversation history, it is added to the history. Saves the chat to the history and attaches the listeners.
             */
            confirmButton.onclick = function() {
                if (conversationHistory[currentIndex]) {
                    conversationHistory[currentIndex].content = input.value;
                } else {
                    conversationHistory.push({ role: 'user', content: input.value });
                }
                parseMessage(textSpan, input.value, user, messageDiv);
                messageDiv.replaceChild(textSpan, input);
                buttonsDiv.innerHTML = '';
                buttonsDiv.appendChild(editButton);
                buttonsDiv.appendChild(deleteButton);
                buttonsDiv.appendChild(copyButton);
                buttonsDiv.appendChild(roleSelect);
                saveChatToHistory();
                attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, input.value, buttonsDiv);
            };
            /**
             * Handles the click event of the cancel button. Replaces the textarea with the text span, clears the buttons div,
             * appends the edit, delete, and copy buttons, and appends the show more button if it exists.
             */
            cancelButton.onclick = function() {
                messageDiv.replaceChild(textSpan, input);
                buttonsDiv.innerHTML = '';
                buttonsDiv.appendChild(editButton);
                buttonsDiv.appendChild(deleteButton);
                buttonsDiv.appendChild(copyButton);
                buttonsDiv.appendChild(roleSelect);
                if (showMoreButtonExists) {
                    messageDiv.appendChild(showMoreButton);
                }
            };
        };
        /**
         * Handles the click event of the delete button. Prompts the user for confirmation and deletes the message if confirmed.
         */
        deleteButton.onclick = function() {
            if (confirm('Are you sure you want to delete this message?')) {
                abortController.abort();
                const currentIndex = parseInt(messageDiv.id.split('-')[1]);
                if (currentIndex === -1) return;
                document.getElementById('messageContainer').removeChild(messageDiv);
                conversationHistory.splice(currentIndex, 1);
                saveChatToHistory();
                reassignMessageIds();
                updateMessageCounters();
            }
        };
        /**
         * Copies the given message to the clipboard and displays an alert indicating success or failure.
         * @return {Promise} A promise that resolves when the text is successfully copied to the clipboard, or rejects with an error if the copy fails.
         */
        copyButton.onclick = function() {
            navigator.clipboard.writeText(message)
                .then(() => alert('Message copied to clipboard!'))
                .catch(e => console.error('Failed to copy text: ', e));
        };
    }
    /**
     * Reassigns unique IDs to each message div element in the message container.
     */
    function reassignMessageIds() {
        const messageContainer = document.getElementById('messageContainer');
        const messageDivs = messageContainer.children;
        for (let i = 0; i < messageDivs.length; i++) {
            messageDivs[i].setAttribute('id', 'message-' + i);
        }
    }
    /**
     * Creates a new message div element and appends it to the message container.
     *
     * @param {string} message - The content of the message.
     * @param {string} role - The role of the message sender ('user', 'assistant', or 'loading').
     * @return {HTMLElement} The created message div element.
     */
    function displayMessage(message, role) {
        const messageDiv = document.createElement('div');
        if (message.trim().startsWith("[")) {
            const infoBubble = document.createElement('div');
            infoBubble.classList.add('info-bubble');
            infoBubble.textContent = 'Quotes hidden.';
            messageDiv.appendChild(infoBubble);
        }
        messageDiv.classList.add('messageDiv')
        messageDiv.setAttribute('id', 'message-' + document.getElementById('messageContainer').children.length);
        messageDiv.style.flexDirection = 'column';
        messageDiv.style.alignItems = 'center';
        const textSpan = document.createElement('span');
        textSpan.classList.add('message-content');
        messageDiv.appendChild(textSpan);
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'message-buttons';
        const editButton = document.createElement('button');
        editButton.innerHTML = editSVG;
        editButton.className = 'edit-button';
        editButton.title = 'Edit this message.';
        editButton.setAttribute('aria-describedby', 'editButtonDesc');
        const copyButton = document.createElement('button');
        copyButton.innerHTML = copySVG;
        copyButton.className = 'copy-button';
        copyButton.title = 'Copy this message to the clipboard.';
        copyButton.setAttribute('aria-describedby', 'copyButtonDesc');
        const roleSelect = document.createElement('select');
        roleSelect.className = 'role-selector';
        roleSelect.title = 'Change the role of this message.';
        roleSelect.setAttribute('aria-describedby', 'roleSelectDesc');
        const roles = ['user', 'assistant', 'system'];
        roles.forEach(r => {
            const option = document.createElement('option');
            option.value = r;
            option.textContent = r.charAt(0).toUpperCase() + r.slice(1);
            if (r === role) {
                option.selected = true;
            }
            roleSelect.appendChild(option);
        });
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = deleteSVG;
        deleteButton.className = 'delete-button';
        deleteButton.title = 'Delete this message.';
        deleteButton.setAttribute('aria-describedby', 'deleteButtonDesc');
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(copyButton);
        buttonsDiv.appendChild(roleSelect);
        buttonsDiv.appendChild(deleteButton);
        messageDiv.className = role === 'user' ? 'user-message' : (role === 'assistant' ? 'assistant-message' : (role === 'system' ? 'system-message' : (role === 'loading' ? 'loading-message' : 'error-message')));
        document.getElementById('messageContainer').appendChild(messageDiv);
        setTimeout(() => {messageDiv.getBoundingClientRect();messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })}, 0);
        if (role !== 'loading') {
            parseMessage(textSpan, message, role === 'user', messageDiv);
            const img = messageDiv.querySelector('img.dalle-image');
            if (img) {
                messageDiv.insertBefore(buttonsDiv, img);
            } else {
                messageDiv.appendChild(buttonsDiv);
            }
            attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, message, buttonsDiv);
        } else {
            textSpan.textContent = message;
        }
        return messageDiv;
    }
    /**
     * Displays an image in the given message div.
     *
     * @param {string} imageUrl - The URL of the image to display.
     * @param {HTMLElement} messageDiv - The message div element to display the image in.
     */
    function displayImage(imageUrl, messageDiv) {
        messageDiv.className = 'image-message';
        let imageElement = messageDiv.querySelector('img');
        if (!imageElement) {
            imageElement = document.createElement("img");
            imageElement.classList.add('dalle-image');
            messageDiv.appendChild(imageElement);
        }
        imageElement.dataset.latestUrl = imageUrl;
        imageElement.onload = () => {
            if (imageElement.dataset.latestUrl === imageUrl) {
                messageDiv.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        };
        imageElement.src = imageUrl;
        imageElement.onclick = () => window.open(imageUrl, "_blank");
    }
    /**
     * Checks if the given message contains any files.
     *
     * @param {string} message - The message to check for files.
     * @return {boolean} Returns true if the message contains files, false otherwise.
     */
    function containsFiles(message) {
        const filePattern = /\n[^\n]+\.\w+\n```\n([\s\S]*?)\n```/g;
        return filePattern.test(message);
    }
    /**
     * Displays files as bubbles in the given container.
     *
     * @param {HTMLElement} container - The container element to display the files in.
     * @param {string} message - The message containing the file details.
     */
    function displayFilesAsBubbles(container, message) {
        const filePattern = /\n[^\n]+\.\w+\n```\n([\s\S]*?)\n```/g;
        let match;
        container.innerHTML = '';
        const contentBeforeFiles = message.replace(filePattern, "");
        if (contentBeforeFiles.trim()) {
            const contentSpan = document.createElement('span');
            parseMarkdownToHTML(contentSpan, contentBeforeFiles.trim());
            container.appendChild(contentSpan);
        }
        while ((match = filePattern.exec(message)) !== null) {
            const fileDetails = match[0];
            const fileName = fileDetails.match(/\n[^\n]+\.\w+/)[0].trim();
            const fileContent = match[1].trim();
            createFileBubble(fileName, container, fileContent);
        }
    }
    /**
     * Saves the current chat to the chat history in the local storage. If there is no current chat,
     * a new chat is created with the current timestamp and conversation history. If there is a current
     * chat, its conversation history is updated. The chat history is then updated in the local storage
     * and the chat list UI is updated.
     */
    function saveChatToHistory() {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        if (currentChatIndex === -1 || currentChatIndex >= chats.length) {
            const chatData = {
                timestamp: new Date().toISOString(),
                title: `Chat on ${new Date().toLocaleString()}`,
                conversation: conversationHistory
            };
            chats.push(chatData);
            currentChatIndex = chats.length - 1;
        } else {
            chats[currentChatIndex].conversation = conversationHistory;
        }
        localStorage.setItem('chats', JSON.stringify(chats));
        updateChatListUI();
    }
    /**
     * Loads the chat history from local storage and displays it in the UI.
     */
    function loadChatHistory() {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        previousChats.innerHTML = '';
        for (let i = chats.length - 1; i >= 0; i--) {
            addChatToUI(chats[i], i);
        }
    }
    /**
     * Updates the chat list UI by clearing the previous chats container and loading the chat history.
     */
    function updateChatListUI() {
        previousChats.innerHTML = '';
        loadChatHistory();
    }
    /**
     * Adds a chat to the UI by creating a list item element and appending it to the previousChats element.
     * The list item contains the chat title and three buttons for generating title, editing, and deleting the chat.
     *
     * @param {Object} chat - The chat object containing the title of the chat.
     * @param {number} index - The index of the chat in the chats array.
     */
    function addChatToUI(chat, index) {
        const li = document.createElement('li');
        li.textContent = `${chat.title || 'Untitled'}`;
        const editButton = document.createElement('button');
        editButton.style.marginTop = '5px'
        editButton.style.marginLeft = '5px';
        editButton.innerHTML = editSVG;
        editButton.title = 'Edit the title of the chat.';
        editButton.setAttribute('aria-describedby', 'editTitleButtonDesc');
        /**
         * Handles the click event of the edit button. Stops the event propagation and calls the editTitle function with the index parameter.
         */
        editButton.onclick = function(event) {
            event.stopPropagation();
            editTitle(index);
        };
        const generateTitleButton = document.createElement('button');
        generateTitleButton.innerHTML = generateSVG;
        generateTitleButton.title = 'Generate a new title for the chat.';
        generateTitleButton.setAttribute('aria-describedby', 'generateTitleButtonDesc');
        /**
         * Handles the click event of the generateTitleButton. Stops the event propagation and calls the fetchChatTitle function with the concatenated content of the chat messages and the index parameter.
         */
        generateTitleButton.onclick = function(event) {
            event.stopPropagation();
            fetchChatTitle(chat.conversation.map(msg => msg.content).join('\n'), index);
        };
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = deleteSVG;
        deleteButton.title = 'Delete the chat.';
        deleteButton.setAttribute('aria-describedby', 'deleteChatButtonDesc');
        /**
         * Handles the click event of the delete button. Stops the event propagation and calls the confirmDelete function with the index parameter.
         */
        deleteButton.onclick = function(event) {
            event.stopPropagation();
            confirmDelete(index);
        };
        const buttonContainer = document.createElement('div');
        li.appendChild(buttonContainer);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(generateTitleButton);
        buttonContainer.appendChild(deleteButton);
        li.style.display = 'flex'
        li.style.flexWrap = 'wrap'
        li.style.alignItems = 'center'
        li.onclick = () => loadChat(index);
        previousChats.appendChild(li);
    }
    /**
     * Edits the title of a chat at the given index in the local storage.
     *
     * @param {number} index - The index of the chat in the chats array.
     */
    function editTitle(index) {
        const newTitle = prompt("Enter new title for the chat:");
        if (newTitle) {
            let chats = JSON.parse(localStorage.getItem('chats'));
            if (chats && chats.length > index) {
                chats[index].title = newTitle;
                localStorage.setItem('chats', JSON.stringify(chats));
                updateChatListUI();
            }
        }
    }
    /**
     * Deletes a chat from the local storage if the user confirms the deletion.
     *
     * @param {number} index - The index of the chat to delete.
     */
    function confirmDelete(index) {
        if (confirm("Are you sure you want to delete this chat?")) {
            let chats = JSON.parse(localStorage.getItem('chats'));
            if (chats && chats.length > index) {
                chats.splice(index, 1);
                localStorage.setItem('chats', JSON.stringify(chats));
                setTimeout(updateMessageCounters(), 0);
                updateChatListUI();
            }
        }
    }
    /**
     * Ends the current chat session by saving the chat history, clearing the message container,
     * resetting the conversation history, updating the UI, and clearing the message box.
     */
    function endChatSession() {
        saveChatToHistory();
        document.getElementById('messageContainer').innerHTML = '';
        document.querySelector('.export-button-container').innerHTML = '';
        conversationHistory = [];
        currentChatIndex = -1;
        backButton.style.display = 'none';
        document.querySelector('.message-form').style.flex = '1'
        document.querySelector('.previous-chats').style.display = 'block';
        sendButton.innerHTML = sendSVG;
        addButton.style.display = ''
        runButton.style.display = ''
        adjustTextareaHeight(messageBox);
        isNewChat = true;
        updateMessageCounters();
        setTimeout(() => {document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })}, 0);
    }
    /**
     * Loads a chat from local storage based on the given index and displays it in the UI.
     *
     * @param {number} index - The index of the chat to load from local storage.
     */
    function loadChat(index) {
        isNewChat = false;
        let chats = JSON.parse(localStorage.getItem('chats'));
        if (chats && chats.length > index) {
            let chatData = chats[index];
            conversationHistory = chatData.conversation;
            currentChatIndex = index;
            document.getElementById('messageContainer').innerHTML = '';
            conversationHistory.forEach(msg => {
                displayMessage(msg.content, msg.role);
            });
            const messageDivs = document.getElementById('messageContainer').children;
            for (let i = 0; i < messageDivs.length; i++) {
                messageDivs[i].setAttribute('id', 'message-' + i);
            }
            backButton.style.display = 'block';
            document.querySelector('.previous-chats').style.display = 'none';
            addExportButton();
            sendButton.innerHTML = sendSVG;
            addButton.style.display = ''
            runButton.style.display = ''
            adjustTextareaHeight(messageBox);
        }
    }
    /**
     * Adds an export button to the export button container.
     */
    function addExportButton() {
        const exportButtonContainer = document.querySelector('.export-button-container');
        // Only create exportChatButton and ShareChatButton if they don't already exist
        if (!(exportButtonContainer.querySelector('#exportChatButton') && exportButtonContainer.querySelector('#shareChatButton'))) {
            const exportButton = document.createElement('button');
            exportButton.innerHTML = exportSVG;
            exportButton.title = 'Export the current chat as a text file.';
            exportButton.setAttribute('aria-describedby', 'exportChatDesc');
            exportButton.id = 'exportChatButton';
            exportButtonContainer.appendChild(exportButton);
            const shareChatButton = document.createElement('button');
            shareChatButton.innerHTML = shareSVG;
            shareChatButton.title = 'Create a shareable link to the current chat.';
            shareChatButton.setAttribute('aria-describedby', 'shareChatDesc');
            shareChatButton.id = 'shareChatButton';
            exportButtonContainer.appendChild(shareChatButton);
        }
        const exportButton = document.getElementById('exportChatButton');
        const shareChatButton = document.getElementById('shareChatButton');
        exportButtonContainer.appendChild(messageCounter);
        messageCounter.style.display = '';
        updateMessageCounters();
        /**
         * Handles the click event of the export button. Exports the current chat as a text file.
         */
        exportButton.onclick = function() {
            const chats = JSON.parse(localStorage.getItem('chats'));
            const chatData = chats[currentChatIndex];
            const formatModal = document.createElement('div');
            formatModal.innerHTML = `
                <div id="formatModal" class="modal">
                    <div class="modal-content" style="text-align: center;">
                        <div class='modal-header'>
                            <span></span>
                            <span class='close'></span>
                        </div>
                        <h3>Choose Export Format:</h3>
                        <button id="formatTextBtn">Formatted Text</button>
                        <button id="formatJSONBtn">JSON</button>
                    </div>
                </div>
            `;
            document.body.appendChild(formatModal);
            document.getElementById('formatModal').querySelector('.close').addEventListener('click', function() {
                formatModal.remove();
            });
            window.addEventListener('click', function(event) {
                if (event.target === document.getElementById('formatModal')) {
                    formatModal.remove();
                }
            });
            formatModal.querySelector('#formatTextBtn').onclick = () => {
                downloadChat(exportChat(currentChatIndex), 'txt');
                formatModal.remove();
            };
            formatModal.querySelector('#formatJSONBtn').onclick = () => {
                downloadChat(JSON.stringify(chatData.conversation), 'json');
                formatModal.remove();
            };
            function downloadChat(content, extension) {
                const chats = JSON.parse(localStorage.getItem('chats'));
                const chatData = chats[currentChatIndex];
                const blob = new Blob([content], { type: extension === 'json' ? 'application/json' : 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${chatData.title || 'Untitled'}.${extension}`;
                a.click();
                URL.revokeObjectURL(url);
            }
        };
        /**
         * Handles the click event of the share chat button. Prompts the user with a confirmation message and saves the chat data to a GitHub Gist if confirmed.
         */
        shareChatButton.onclick = function() {
            const confirmation = confirm('Warning: Do not share sensitive data. The only way to un-share the chat is to contact @pianoth and sending the chat link to be removed.\n\nDo you want to create a public link for this chat?');
            if (confirmation) {
                saveChatToGist(conversationHistory);
            }
        };
    }
    /**
     * Exports a chat at the specified index from the local storage.
     *
     * @param {number} index - The index of the chat to export.
     * @return {string} The exported chat text, with each message formatted as "*role* : content\n\n---\n\n".
     */
    function exportChat(index) {
        let chats = JSON.parse(localStorage.getItem('chats'));
        if (chats && chats.length > index) {
            let chatData = chats[index];
            let exportText = '';
            chatData.conversation.forEach(msg => {
                exportText += `*${msg.role}* : ${msg.content}\n\n---\n\n`;
            });
            return exportText.substring(0, exportText.length - 7);
        }
    }
    /**
     * Saves the chat data to a GitHub Gist.
     *
     * @param {Object} chatData - The chat data to be saved.
     * @return {Promise} A promise that resolves when the chat data is successfully saved, or rejects with an error if there was a problem.
     */
    function saveChatToGist(chatData) {
        const apiUrl = 'https://shiny-rice-f8c5.pianothshaveck.workers.dev/api/gist';
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create',
                content: JSON.stringify(chatData)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                const shareableLink = `${window.location.origin}${window.location.pathname}?gist=${data.id}`;
                if (confirm('Shareable link created: ' + shareableLink + '\n\nDo you want to copy the URL to the clipboard?')) {
                    navigator.clipboard.writeText(shareableLink)
                        .then(() => alert('Link copied to clipboard.'))
                        .catch(error => console.error('Failed to copy link: ', error));
                }
            } else {
                console.error('Failed to save chat data:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    /**
     * Loads chat data from a GitHub Gist based on the URL path.
     *
     * @return {Promise} A promise that resolves when the chat data is successfully loaded and displayed,
     * or rejects with an error if there was a problem.
     */
    function loadChatFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const gistId = urlParams.get('gist');
        if (gistId) {
            fetch(`https://api.github.com/gists/${gistId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.files && data.files['chat.json']) {
                        conversationHistory = JSON.parse(data.files['chat.json'].content);
                        displayLoadedChat();
                    } else {
                        console.error('No chat data found for this ID.');
                    }
                })
                .catch(error => {
                    console.error('Error loading chat:', error);
                });
        }
    }
    //Message counters
    const messageCounter = document.createElement('div');
    messageCounter.classList.add('message-counter');
    messageCounter.textContent = 'Messages: 0';
    messageCounter.style.display = 'none';
    const globalMessageCounter = document.createElement('div');
    globalMessageCounter.classList.add('global-message-counter');
    globalMessageCounter.textContent = 'Total Messages: 0';
    document.querySelector('.previous-chats').appendChild(globalMessageCounter);
    /**
     * Updates the message counters by calculating the number of messages in the conversation history and the total number of messages across all chats.
     */
    function updateMessageCounters() {
        const messageCount = conversationHistory.length;
        messageCounter.textContent = `Messages: ${messageCount}`;
        let totalMessageCount = 0;
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        chats.forEach(chat => {
            totalMessageCount += chat.conversation.length;
        });
        globalMessageCounter.textContent = `Total Messages: ${totalMessageCount}`;
    }
    /**
     * Displays the loaded chat by clearing the message container, iterating over the conversation history,
     * and displaying each message using the displayMessage function. It also updates the display of the
     * back button, hides the previous chats container, and sets the text content of the send button to 'Send Message'.
     */
    function displayLoadedChat() {
        document.getElementById('messageContainer').innerHTML = '';
        conversationHistory.forEach(msg => {
            displayMessage(msg.content, msg.role);
        });
        backButton.style.display = 'block';
        document.querySelector('.previous-chats').style.display = 'none';
        sendButton.innerHTML = sendSVG;
        addButton.style.display = ''
        runButton.style.display = ''
        saveChatToHistory();
        addExportButton();
    }
    const searchTextarea = document.createElement('textarea');
    searchTextarea.id = 'searchTextarea';
    searchTextarea.placeholder = 'Search chats...';
    document.querySelector('.previous-chats-controls').appendChild(searchTextarea);
    const searchButton = document.getElementById('searchButton');
    searchButton.innerHTML = searchSVG
    const exportButton = document.getElementById('exportDataButton');
    exportButton.innerHTML = exportSVG
    const importButton = document.getElementById('importDataButton');
    importButton.innerHTML = importDataSVG
    const deleteButton = document.getElementById('deleteDataButton');
    deleteButton.innerHTML = deleteDataSVG
    const closeSearchButton = document.getElementById('closeSearchButton');
    searchButton.addEventListener('click', function() {
        searchTextarea.style.display = 'block';
        searchButton.style.display = 'none';
        exportButton.style.display = 'none';
        importButton.style.display = 'none';
        deleteButton.style.display = 'none';
        closeSearchButton.innerHTML = cancelSVG
        closeSearchButton.style.display = 'inline';
    });
    closeSearchButton.addEventListener('click', function() {
        searchTextarea.style.display = 'none';
        searchTextarea.value = '';
        searchButton.style.display = 'inline';
        exportButton.style.display = 'inline';
        importButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
        closeSearchButton.style.display = 'none';
        document.querySelectorAll('.previous-chats li').forEach(li => li.style.display = 'list-item');
    });
    searchTextarea.addEventListener('input', function() {
        const filter = searchTextarea.value.toLowerCase();
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        document.querySelectorAll('.previous-chats li').forEach((li, index) => {
            const reversedIndex = chats.length - 1 - index;
            const chat = chats[reversedIndex];
            const chatTitle = chat.title.toLowerCase();
            const chatContent = chat.conversation.map(message => message.content.toLowerCase()).join(' ');
            if (chatTitle.includes(filter) || chatContent.includes(filter)) {
                li.style.display = 'list-item';
            } else {
                li.style.display = 'none';
            }
        });
    });
    exportButton.addEventListener('click', function() {
        if (confirm('Do you want to export the chats to the clipboard?')) {
            const chats = localStorage.getItem('chats');
            if (chats) {
                navigator.clipboard.writeText(chats)
                    .then(() => alert('Chats exported to clipboard.'))
                    .catch(e => console.error('Failed to copy chats: ', e));
            } else {
                alert('No chats available to export.');
            }
        }
    });
    /**
     * Formats a conversation string into an array of objects.
     *
     * @param {string} conversation - The conversation string to format.
     * @return {string} The formatted conversation as a JSON string.
     */
    function formatConversation(conversation) {
        const messages = conversation.split("---\n");
        const formattedMessages = messages
        .filter((msg) => msg.trim() !== "")
        .map((msg) => {
            const roleMatch = msg.trim().match(/^\*(.*?)\*\s:/);
            const role = roleMatch ? roleMatch[1].toLowerCase() : "";
            const content = roleMatch
            ? msg.replace(roleMatch[0], "").trim()
            : msg.trim();
            return {role, content};
        });
        return JSON.stringify(formattedMessages);
    }
    importButton.addEventListener('click', function() {
        if (confirm('Do you want to import chats from the clipboard? You need to click the paste button after this confirming. If you import multiple chats, your previous chats history will be overwritten; if you import a single chat, the chat will be loaded.')) {
            navigator.clipboard.readText()
                .then(text => {
                    try {
                        const importedChats = JSON.parse(text);
                        if (Array.isArray(importedChats)) {
                            if (importedChats[0].timestamp) {
                                localStorage.setItem('chats', JSON.stringify(importedChats));
                                updateChatListUI();
                                updateMessageCounters();
                                alert('Chats imported successfully.');
                            } else {
                                try {
                                    if (!importedChats[0].role) throw Error('Invalid chat data.');
                                    conversationHistory = importedChats;
                                    displayLoadedChat();
                                } catch (e) {
                                    alert('Invalid chat data.');
                                }
                            }
                        } else {
                            alert('Invalid chat data.');
                        }
                    } catch (e) {
                        const importedChat = JSON.parse(formatConversation(text));
                        try {
                            if (!importedChat[0].role) throw Error('Invalid chat data.');
                            conversationHistory = importedChat;
                            displayLoadedChat();
                        } catch (e) {
                            alert('Invalid chat data.');
                        }
                    }
                })
                .catch(e => console.error('Failed to read from clipboard: ', e));
        }
    });
    deleteButton.addEventListener('click', function() {
        if (confirm('Do you want to delete all chats?')) {
            localStorage.removeItem('chats');
            updateChatListUI();
            updateMessageCounters();
            alert('All chats deleted.');
        }
    });
    // Light theme toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            document.body.style.backgroundColor = '#f1f1f1';
            document.documentElement.style.backgroundColor = '#f1f1f1';
        } else {
            localStorage.removeItem('theme');
            document.body.style.backgroundColor = '#333';
            document.documentElement.style.backgroundColor = '#333'
        }
    });
    if (localStorage.getItem('theme')) {
        document.body.classList.add('light-mode');
        document.body.style.backgroundColor = '#f1f1f1';
        document.documentElement.style.backgroundColor = '#f1f1f1';
    }
    const systemPromptsList = document.getElementById('systemPromptsList');
    const saveSystemPromptButton = document.getElementById('saveSystemPromptButton');
    const loadPromptsModal = document.getElementById('loadPromptsModal');
    const    closeLoadPromptsModal = loadPromptsModal.querySelector('.close');
    /**
     * Loads system prompts from local storage and displays them in a modal.
     */
    function loadSystemPrompts() {
        const savedPrompts = JSON.parse(localStorage.getItem('systemPrompts')) || [];
        systemPromptsList.innerHTML = '';
        savedPrompts.forEach((prompt, index) => {
            const li = document.createElement('li');
            li.textContent = prompt.name;
            li.addEventListener('click', () => {
                systemPromptInput.value = prompt.content;
                adjustTextareaHeight(systemPromptInput);
                document.getElementById('loadPromptsModal').style.display = 'none';
            });
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteSystemPrompt(index);
            });
            li.appendChild(deleteButton);
            systemPromptsList.appendChild(li);
        });
        document.getElementById('loadPromptsModal').style.display = 'flex';
    }
    closeLoadPromptsModal.addEventListener('click', function() {
        loadPromptsModal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === loadPromptsModal) {
            loadPromptsModal.style.display = 'none';
        }
    });
    /**
     * Saves a system prompt to the local storage.
     */
    function saveSystemPrompt() {
        const promptName = prompt('Enter a name for the system prompt:');
        const promptContent = systemPromptInput.value.trim();
        if (promptName && promptContent) {
            const savedPrompts = JSON.parse(localStorage.getItem('systemPrompts')) || [];
            savedPrompts.push({ name: promptName, content: promptContent });
            localStorage.setItem('systemPrompts', JSON.stringify(savedPrompts));
            alert('System prompt saved successfully!');
        }
    }
    /**
     * Deletes a system prompt from the local storage.
     *
     * @param {number} index - The index of the system prompt to delete.
     */
    function deleteSystemPrompt(index) {
        const savedPrompts = JSON.parse(localStorage.getItem('systemPrompts')) || [];
        savedPrompts.splice(index, 1);
        localStorage.setItem('systemPrompts', JSON.stringify(savedPrompts));
        loadSystemPrompts();
    }
    saveSystemPromptButton.addEventListener('click', saveSystemPrompt);
    document.getElementById('loadSystemPromptButton').addEventListener('click', loadSystemPrompts);
});