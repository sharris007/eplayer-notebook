import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

import '../assets/temp.styl';

@DragDropContext(HTML5Backend)
export default class Board extends Component {
    static propTypes = {
      lists: PropTypes.array.isRequired,
      callback: PropTypes.func
    };

    constructor(props) {
      super(props);
      this.moveCard = this.moveCard.bind(this);
      this.moveList = this.moveList.bind(this);
      this.findList = this.findList.bind(this);
      this.scrollRight = this.scrollRight.bind(this);
      this.scrollLeft = this.scrollLeft.bind(this);
      this.stopScrolling = this.stopScrolling.bind(this);
      this.startScrolling = this.startScrolling.bind(this);
      this.addCard = this.addCard.bind(this);
      this.cancelAddCard = this.cancelAddCard.bind(this);
      this.saveCard = this.saveCard.bind(this);
      this.handleOnChange = this.handleOnChange.bind(this);
      this.state = {
        isScrolling: false,
        search: '',
        lists: props.lists,
        notesList:[]
      };
    }

    componentWillMount() {
        // number of columns   this.props.getLists(10);
        //this.props.getLists(6);
        // this.delayedCallback = _.debounce(function (event) {
        //   // `event.target` is accessible now
        // }, 1000);
    }

    startScrolling(direction) {
        // if (!this.state.isScrolling) {
      switch (direction) {
      case 'toLeft':
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case 'toRight':
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
      }
        // }
    }

    scrollRight() {
      function scroll() {
        document.getElementsByTagName('main')[0].scrollLeft += 10;
      }
      this.scrollInterval = setInterval(scroll, 10);
    }

    scrollLeft() {
      function scroll() {
        document.getElementsByTagName('main')[0].scrollLeft -= 10;
      }
      this.scrollInterval = setInterval(scroll, 10);
    }

    stopScrolling() {
      this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
    }

    moveCard(lastX, lastY, nextX, nextY) {
        //this.props.moveCard(lastX, lastY, nextX, nextY);
      const newLists = [...this.state.lists];
      if (lastX === nextX) {
        newLists[lastX].cards.splice(
                nextY,
                0,
                newLists[lastX].cards.splice(lastY, 1)[0]
            );
      } else {
            // move element to new place
        newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
            // delete element from old place
        newLists[lastX].cards.splice(lastY, 1);
      }
      this.setState({ lists: newLists });
    }

    moveList(listId, nextX) {
      const { lastX } = this.findList(listId);
        //this.props.moveList(lastX, nextX);
      const newLists = [...this.state.lists];
      const t = newLists.splice(lastX, 1)[0];

      newLists.splice(nextX, 0, t);
      this.setState({lists:newLists});
    }

    findList(id) {
      const { lists } = this.state;
      const list = lists.filter(l => l.id === id)[0];

      return {
        list,
        lastX: lists.indexOf(list)
      };
    }

    addCard() {
        //this.props.addCard();
      const newLists = [...this.state.lists];
      const notesList = [...this.state.notesList];

      newLists[0].cards[0] = {
        id: newLists[0].cards.length + 1,
        firstName: 'new',
        lastName: 'bill',
        title: 'bill',
        cardFormat: 'create new',
        content: 'bill',
        content2: 'bill',
        wikiImage: 'bill',
        changeDate: 'February 12, 2003'
      };

      notesList.map((item, i) => {
        const index = i % quantity;
        lists[index].cards.push(item);
      });



      // newLists[0].cards.unshift({
      //   id: newLists[0].cards.length + 1,
      //   firstName: 'new',
      //   lastName: 'bill',
      //   title: 'bill',
      //   cardFormat: 'create new',
      //   content: 'bill',
      //   content2: 'bill',
      //   wikiImage: 'bill'
      // });

      this.setState({lists:newLists});
    }

    cancelAddCard() {
        //this.props.cancelAddCard();
      const newLists = [...this.state.lists];
      newLists[0].cards[0] = {
        id: 0,
        firstName: 'new',
        lastName: 'bill',
        title: 'bill',
        cardFormat: 'add mode',
        content: 'bill',
        content2: 'bill',
        wikiImage: 'bill',
        changeDate: 'January 11, 1977'
      };

      this.setState({lists:newLists});
    }

    saveCard(newNote) {
      //this.props.saveCard(newNote);

      const newLists = [...this.state.lists];
      newLists[1].cards.unshift({
        id: new Date(),
        firstName: 'new',
        lastName: 'bill',
        title: newNote.title,
        cardFormat: 'note',
        content: 'The quick brown fox jumped over the lazy dog.',
        content2: 'The cubs are world series champions',
        wikiImage: 'bill',
        changeDate: newNote.changeDate
      });

      newLists[0].cards[0] = {
        id: 0,
        firstName: 'new',
        lastName: 'bill',
        title: 'bill',
        cardFormat: 'add mode',
        content: 'bill',
        content2: 'bill',
        wikiImage: 'bill',
        changeDate: 'January 13, 1977'
      };

      /*return state.withMutations(ctx => {
        ctx.set("lists", newLists);
      });*/
      this.setState({lists:newLists});
      return false;

      const _id = newLists[0].cards[0].id;
      newLists[0].cards.shift();

      newLists[0].cards.unshift({
        id: _id + 777,
        firstName: 'new',
        lastName: 'bill',
        title: 'Newly added note',
        cardFormat: 'note',
        content: 'The quick brown fox jumped over the lazy dog.',
        content2: 'The cubs are world series champions',
        wikiImage: 'bill',
        changeDate: 'January 23, 1977'
      });

      // newLists[0].cards.unshift({
      //   id: newLists[0].cards.length + 1,
      //   firstName: 'new',
      //   lastName: 'bill',
      //   title: 'bill',
      //   cardFormat: 'note',
      //   content: 'bill',
      //   content2: 'bill',
      //   wikiImage: 'bill'
      // });

      // newLists[0].cards.map((item, i) => {
      //   return item.cardFormat == 'create new' ? { cardFormat: 'note' }: item;
      // });

      // newLists[0].cards[0] = {
      //   id: newLists[0].cards[0].id,
      //   firstName: 'new',
      //   lastName: 'bill',
      //   title: 'bill',
      //   cardFormat: 'note',
      //   content: 'bill',
      //   content2: 'bill',
      //   wikiImage: 'bill'
      // };

      console.log(JSON.stringify(newLists[0].cards[0]));

      //   newLists = newLists.map(function(item) { return item.cardFormat == 'create new' ? 'note' : 'note'; });

      // newLists[0].cards[0].cardFormat = 'note';

      //  newLists.splice(nextX, 0, t);

      /*return state.withMutations(ctx => {
        ctx.set("lists", newLists);
      });*/
    }

    handleOnChange(event) {
      this.props.getLists(6);
      this.setState({ search: event.target.value });
    }

    render() {
      const { lists } = this.state;

      const filteredList = lists.filter(list => {
        list.cards = list.cards.filter(card => {
          return (
                    card.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
                    -1
                );
        });
        return true;
      });

      return ( <main>
                <div style = {{ height: '100%' }} >
                    <CustomDragLayer snapToGrid = {false}/> {
                    filteredList.map((item, i) => ( 
                        <CardsContainer key = {item.id} id = {item.id} item = {item} moveCard = {this.moveCard} 
                        moveList = {this.moveList} startScrolling = {this.startScrolling} stopScrolling = {this.stopScrolling} isScrolling = {this.state.isScrolling} 
                        cancelAddCard = {this.cancelAddCard} saveCard = {this.saveCard} addCard = {this.addCard} x = {i}/>
                    ))
                    } 
                </div> 
            </main>
            );
    }
}
