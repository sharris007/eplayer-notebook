import NoteBookComponent from '../main'; // to demo direct API usage

import faker from "faker";

function mapNotes(notesList, lists, quantity) {
    notesList.map((item, i) => {
        let index = i % quantity;
        lists[index].cards.push(item);
    });
}

function init(quantity) {
    const lists = [];
    const notesList = [];
    // initialize lists
    for (let ic = 0; ic < quantity; ic++) {
        lists.push({
            id: ic,
            name: "",
            cards: []
        });
    }

    notesList.push({
        id: 0,
        firstName: "new",
        lastName: faker.name.lastName(),
        title: faker.name.jobTitle(),
        cardFormat: "add mode",
        content: faker.lorem.paragraph(),
        content2: faker.lorem.paragraph(),
        wikiImage: faker.image.animals(),
        changedDate: "December 27, 1967"
    });

    //    const randomQuantity = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
    const randomQuantity = 20;
    for (let ic = 1; ic < randomQuantity; ic++) {
        notesList.push({
            id: ic,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            title: faker.name.jobTitle(),
            cardFormat: "note",
            content: faker.lorem.paragraph(),
            content2: faker.lorem.paragraph(),
            wikiImage: faker.image.animals(),
            changedDate: "December 27, 1967"
        });
    }

    mapNotes(notesList, lists, quantity);


    new NoteBookComponent({
        elementId: 'demo',
        locale: 'en-us',
        callback: (msg, data) => {
            console.log(msg, data);
        },
        lists:lists
    });
}

window.onload = init(5);