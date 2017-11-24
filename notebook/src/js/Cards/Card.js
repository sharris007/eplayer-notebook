import React, { Component, PropTypes } from "react";
import ImageUploader from "./ImageUploader";
import Moment from "moment";

// const propTypes = {
//   item: PropTypes.object.isRequired,
//   style: PropTypes.object,
//   cancelAddCard: PropTypes.func,
//   saveCard: PropTypes.func,
//   addCard: PropTypes.func
// };

const galPng = require("../../assets/images/gal.png");
const delPng = require("../../assets/images/del.png");
const cogPng = require("../../assets/images/cog.png");
const deletePng = require("../../assets/images/delete-icon.png");
const fivePng = require("../../assets/images/5.jpg");
const gotoPng = require("../../assets/images/goto-arrow-ico.png");
const addPng = require("../../assets/images/add.png");
const editPng = require("../../assets/images/edit.png");

const ellipsis = {
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  background: "#ffffff !important",
  WebkitBoxOrient: "vertical"
};

const mainIdea = {
  backgroundColor: "#bbf2b6",
  height: "36px",
  paddingTop: "10px",
  paddingLeft: "10px"
};

const fromInstructor = {
  backgroundColor: "#ccf5fd",
  height: "36px",
  paddingTop: "10px",
  paddingLeft: "10px"
};

const observations = {
  backgroundColor: "#fed3ec",
  height: "36px",
  paddingTop: "10px",
  paddingLeft: "10px"
};

const questions = {
  backgroundColor: "#ffedad",
  height: "36px",
  paddingTop: "10px",
  paddingLeft: "10px"
};

const styleContent = {
  width: "228px",
  height: "154px",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "1.57",
  letterSpacing: "-0.2px",
  textAlign: "left",
  color: "#252525"
};

const styleContent2 = {
  width: "228px",
  height: "154px",
  fontSize: "14px",
  lineHeight: "1.57",
  letterSpacing: "-0.3px",
  textAlign: "left",
  color: "#252525"
};

const date = {
  fontSize: "12px",
  letterSpacing: "-0.1px",
  textAlign: "left",
  color: "#6a7070",
  padding: "15px",
  paddingBottom: 0,
  background: "white"
};

const title = {
  fontSize: "18px",
  letterSpacing: "-0.4px",
  textAlign: "left",
  color: "#252525",
  fontWeight: "300",
  lineHeight: "1.44",
  padding: "15px",
  paddingBottom: 0,
  whiteSpace: "normal",
  background: "white"
};

const titleInputBox = {
  outline: "0",
  width: "100%",
  background: "transparent",
  borderTop: "0",
  borderRight: "0",
  borderLeft: "0",
  borderBottom: "1px solid black",
  marginTop: "32px"
};

const relatesToDropDown = {
  borderRight: "0px",
  borderTop: "0px",
  borderLeft: "0px",
  borderColor: "black !important",
  width: "100%",
  background: "transparent",
  outline: "0px",
  marginTop: "32px",
  background: "white"
};

const noteTextArea = {
  borderRight: "0px",
  borderTop: "0px",
  borderLeft: "0px",
  borderBottom: "0px",
  width: "100%",
  outline: "0px",
  marginTop: "32px",
  background: "white"
};

const addNote = {
  paddingLeft: "72px",
  color: "#1ca6a5",
  fontWeight: "600",
  lineHeight: "1.57",
  fontSize: "14px"
};

const line = {
  height: "2px",
  border: "solid 1px #e9e9e9",
  marginLeft: "15px",
  marginRight: "15px"
};

const fullName = "";

export default class Card extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object,
    cancelAddCard: PropTypes.func,
    saveCard: PropTypes.func,
    addCard: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleCancelAddCard = this.handleCancelAddCard.bind(this);
    this.handleSaveCard = this.handleSaveCard.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    // this.addCard = this.addCard.bind(this);
    // this.cancelAddCard = this.cancelAddCard.bind(this);
    // this.saveCard = this.saveCard.bind(this);
    this.state = { _title: "aas" };
  }

  handleCancelAddCard = e => {
    this.props.cancelAddCard();
  };

  handleSaveCard = e => {
    // this.setState({
    //   titleInput: this.titleInput.value
    // });

    const newNote = {
      title: this.titleInput.value,
      changeDate: Moment(new Date()).format("MMMM DD, YYYY")
    };

    this.props.saveCard(newNote);
  };

  handleAddCard = e => {
    this.props.addCard();
  };

  render() {
    const { style, item, cancelAddCard, saveCard } = this.props;

    return (
      <div
        style={{ background: "white" }}
        className="item"
        id={style ? item.id : null}
      >
        {item.cardFormat == "note" && item.id % 5 == 0 ? (
          <div className="item-name" style={mainIdea}>
            Main Idea
          </div>
        ) : null}
        {item.cardFormat == "note" && item.id % 5 == 1 ? (
          <div className="item-name" style={fromInstructor}>
            From Instructor
          </div>
        ) : null}
        {item.cardFormat == "note" && item.id % 5 == 2 ? (
          <div className="item-name" style={observations}>
            Observations
          </div>
        ) : null}
        {item.cardFormat == "note" && item.id % 5 == 3 ? (
          <div className="item-name" style={questions}>
            Questions
          </div>
        ) : null}
        {item.cardFormat == "note" ? (
          <div style={date}>December 27, 1967{item.changeDate}</div>
        ) : null}
        {item.cardFormat != "add mode" ? (
          <div style={title}>{item.title}</div>
        ) : null}
        {item.cardFormat == "add mode" ? (
          <div style={{ paddingTop: "100px" }} />
        ) : null}
        {item.cardFormat == "add mode" ? (
          <span style={{ paddingLeft: "85px", paddingBottom: "8px" }}>
            <button
              onClick={this.handleAddCard}
              style={{ border: "0", background: "transparent" }}
            >
              <img src={addPng} />
            </button>
          </span>
        ) : null}
        {item.cardFormat == "add mode" ? (
          <div style={addNote}>Add Note</div>
        ) : null}
        {item.cardFormat == "add mode" ? (
          <div style={{ paddingBottom: "100px" }} />
        ) : null}

        {item.cardFormat != "note" ? (
          <div className="item-container">
            <div className="item-content">
              <div id="create-card" className="Mask">
                {item.cardFormat != "add mode" ? (
                  <input
                    style={titleInputBox}
                    ref={el => {
                      this.titleInput = el;
                    }}
                    placeholder="Title"
                  />
                ) : null}

                {this.state.titleInput}

                {item.cardFormat != "add mode" ? (
                  <textarea
                    rows="10"
                    cols="50"
                    style={noteTextArea}
                    placeholder="Write note..."
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="item-container">
              <div className="item-content" style={ellipsis}>
                <span style={styleContent}>“{item.content}”</span>
              </div>
            </div>

            <div style={line} />

            <div className="item-container">
              <div className="item-content">
                <span style={styleContent2}>{item.content2}</span>
              </div>
            </div>
          </div>
        )}

        {item.cardFormat == "note" ? (
          <div className="item-perfomers">
            <div className="add-perfomers">
              <a href="#">
                <img
                  style={{ height: "24px", width: "24px" }}
                  src={deletePng}
                  alt="delete"
                />
              </a>
            </div>
            <div className="add-perfomers">
              <a href="#">
                <img
                  style={{ height: "24px", width: "24px" }}
                  src={editPng}
                  alt="delete"
                />
              </a>
            </div>
            <div className="delete-perfomers">
              <div className="perfomer">
                <a href="#">
                  <img
                    style={{ height: "24px", width: "24px" }}
                    src={gotoPng}
                    alt="delete"
                  />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="item-perfomers">
            {item.cardFormat == "create new" ? (
              <div className="add-perfomers">
                <a
                  style={{ paddingRight: "10px", color: "#1ca6a5" }}
                  href="#"
                  onClick={this.handleSaveCard}
                >
                  Save
                </a>
                <a
                  style={{ paddingRight: "10px", color: "#1ca6a5" }}
                  href="#"
                  onClick={this.handleCancelAddCard}
                >
                  Cancel
                </a>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

// Card.propTypes = propTypes;

//export default Card;
