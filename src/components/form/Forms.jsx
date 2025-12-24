import React, { useEffect, useState } from "react";
import Preview from "./Preview";
import "./forms.css";
import Loader from "../../components/loader/Loader";
import Drawer from "../../components/drawer/Drawer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnquiryFormThunk, updateEnquiryFormThunk } from "../../store/EnquiryForm";

function Forms({name}) {
  const optionArray = [{ option: "", page: null }];
  const dispatch = useDispatch();
  const nestedArray = [{ question: "", options: optionArray, type: "radio" }];
  const [forms, setForms] = useState(nestedArray);
  const [showView, setShowView] = useState(false);
  const [mJson, setmJson] = useState(null);
  const [prog, setProg] = useState(false);
  const{surveyData, isLoading, error} = useSelector((state)=>state.enquiry)

  function closePreview() {
    setShowView(false);
  }

  useEffect(()=>{
    dispatch(fetchEnquiryFormThunk({name}));
  },[dispatch, name])

  useEffect(()=>{
    if(surveyData){
      setForms(surveyData?.enquiryDetails || [])
    }
  },[surveyData])

  function validateForm() {
    let noError = true;
    outerLoop: for (let i = 0; i < forms.length; i++) {
      if (forms[i].question === "") {
        toast.error("Question " + (i + 1) + " is Empty");
        noError = false;
        break outerLoop;
      } else if (forms[i].options.length <= 0) {
        noError = false;
        toast.error("Question " + (i + 1) + " Has no options");
        break;
      } else {
        for (let j = 0; j < forms[i].options.length; j++) {
          if (forms[i].options[j].option === "") {
            noError = false;
            toast.error(
              "Question " + (i + 1) + "'s options " + (j + 1) + " is Empty"
            );
            break outerLoop;
          }
        }
      }
    }
    return noError;
  }

  function onOptionChanged(index) {
    let oldArr = [...forms];
    oldArr[index].options.forEach((val) => {
      val.page = null;
    });
    setForms(oldArr);
  }

  function addOptionFun(index) {
    let temp = [...forms];
    let newObj;
    if (temp[index].type === "checkbox") {
      newObj = { option: "", page: temp[index].options[0].page };
    } else {
      newObj = { option: "", page: null };
    }
    temp[index].options.push(newObj);
    setForms(temp);
  }

  function addQuestion() {
    let temp = [...forms];
    let otherQ = { question: "", options: optionArray, type: "radio" };
    temp.push(otherQ);
    setForms(temp);
  }

  function deleteQuestion(index) {
    let confirm = window.confirm("Are You Sure You want to Delete Question");
    if (confirm === true) {
      let temp = [...forms];
      temp.splice(index, 1);
      setForms(temp);
    }
  }
  // function deleteQuestion(index) {
  //   if (window.confirm("Are You Sure You want to Delete Question")) {
  //     setForms(forms.filter((_, formIndex) => formIndex !== index));
  //   }
  // }

  function deleteOption(questionIndex, optionIndex) {
    let confirm = window.confirm("Are You Sure You want to Delete Option");
    if (confirm === true) {
      let temp = JSON.parse(JSON.stringify([...forms]));
      const questionTemp = temp[questionIndex].options.filter((x, idx) => idx !== optionIndex);
      temp[questionIndex].options = questionTemp;
      setForms(temp);
    }
  }

  function getQuestionSelect(key, index) {
    let selectedTxt = "";
    if (index !== -1) {
      let mIndex = forms[key].options[index]?.page;
      if (mIndex !== null && mIndex !== undefined) {
        selectedTxt = [...forms.map((x) => x.question), "end"][mIndex + 1];
      } else {
        selectedTxt = "end";
      }
    } else {
      selectedTxt = [...forms.map((x) => x.question), "end"][forms[key].options[0]?.page + 1] || "end";
    }
  
    return (
      <select
        value={forms[key].options[index]?.page !== null ? [...forms.map((x) => x.question), "end"][forms[key].options[index]?.page] : 'end'}
        onChange={(x) => {
          let newArr = JSON.parse(JSON.stringify([...forms]));
          let pageIndex = newArr.findIndex((m) => m.question === x.target.value);
          if (index !== -1) {
            newArr[key].options[index].page = pageIndex;
            setForms(newArr);
          } else {
            let i = 0;
            newArr[key].options.forEach(() => {
              newArr[key].options[i].page = pageIndex;
              i++;
            });
            setForms(newArr);
          }
        }}
        id="selectBox"
        className="select-input service-input"
      >
        {[...forms.map((x) => x.question), "end"].map((opt, mKey) => (
          <React.Fragment key={mKey}>
            {key < mKey ? (
              <option key={mKey} value={opt}>
                {opt}
              </option>
            ) : null}
          </React.Fragment>
        ))}
      </select>
    );
  }

  function onFormSubmit() {
    let noError = validateForm();
    if (noError) {
      let confirm = window.confirm("Are You Sure You want to Submit the Form");
      if (confirm === true) {
        dispatch(updateEnquiryFormThunk({enquiryDetails:[...forms], name}))
      }
    }
  }

  function onFormPreview() {
    let noError = validateForm();
    if (noError) {
      setShowView(true);
      let jsonStr = JSON.stringify(forms);
      setmJson(jsonStr);
    }
  }

  return (
    <Drawer>
      <div className="listMain">
        {showView && <Preview data={mJson} closePreview={closePreview} />}

        <h2>Forms</h2>
        <div className="horizontal-spacer" style={{ padding: "4px 12px" }}>
          <button
            style={{ width: "80px", borderRadius: "4px" }}
            className="update-btn"
            onClick={() => {
              if (forms.length > 0) {
                onFormPreview();
              } else {
                toast.error('Please add the questions');
              }
            }}
          >
            Preview
          </button>
        </div>
        { isLoading && <Loader/>}
        { error && <div className="errDiv"><p>{error}</p></div>}
        <div className="main-quiz-form">
          {forms?.map((val, key) => (
            <div className="quiz-container" key={key}>
              <p style={{ color: "blue", margin: "20px 0px", fontWeight: "semi-bold" }}>
                Question {key + 1}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '11fr 1fr', alignItems: 'center' }}>
                <input
                  value={val.question}
                  onChange={(x) => {
                    let old = JSON.parse(JSON.stringify(forms))
                    old[key].question = x.target.value;
                    setForms(old);
                  }}
                  className="service-input full-width-input"
                  id="questionInput"
                  placeholder="Enter Your Question?"
                  style={{ padding: "0px 12px", width: '100%', height: '40px' }}
                />
                <button
                  className="update-btn"
                  style={{ backgroundColor: "var(--danger)" }}
                  onClick={() => deleteQuestion(key)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="type-container">
                <div style={{ marginTop: "4px" }}>
                  <input
                    onChange={() => {
                      let old = [...forms];
                      old[key].type = "radio";
                      setForms(old);
                      onOptionChanged(key);
                    }}
                    checked={val.type === "radio"}
                    type="radio"
                  />
                  <label style={{ marginLeft: "6px" }}>Radio Button</label>

                  <input
                    onChange={() => {
                      let old = [...forms];
                      old[key].type = "checkbox";
                      setForms(old);
                      onOptionChanged(key);
                    }}
                    checked={val.type === "checkbox"}
                    type="radio"
                    style={{ marginLeft: "20px" }}
                  />
                  <label style={{ marginLeft: "6px" }}>Check Box</label>
                </div>

                <p
                  style={{ fontSize: "14px", color: "blue", cursor: "pointer", userSelect: "none" }}
                  onClick={() => addOptionFun(key)}
                >
                  + Add Options
                </p>
              </div>
              
              <div style={{ marginTop: "20px" }} />
              {val.options.map((element, index) => (
                <div className="option-container" key={index}>
                  <input
                    value={element.option}
                    onChange={(x) => {
                      let newForm = [...forms];
                      newForm[key].options[index].option = x.target.value;
                      setForms(newForm);
                    }}
                    className="service-input"
                    placeholder="Enter Your Option"
                  />
                  <div style={{ width: "10px" }} />
                  {val.type === "checkbox" ? getQuestionSelect(key, -1) : getQuestionSelect(key, index)}
                  {/* {val.type === "radio" && getQuestionSelect(key, index)} */}
                  <button
                    className="update-btn"
                    style={{ backgroundColor: "var(--danger)" }}
                    onClick={() => deleteOption(key, index)}
                  >
                    <span className="bi bi-trash"></span>
                  </button>
                </div>
              ))}
            </div>
          ))}

          <div className="horizontal-spacer" style={{ padding: "4px 12px" }}>
            <button
              className="update-btn"
              onClick={() => addQuestion()}
            >
              Add Question
            </button>
            <button
              className="update-btn"
              style={{ width: "80px" }}
              onClick={() => onFormSubmit()}
            >
              Submit
            </button>
          </div>

          {/* <div className="horizontal-spacer" style={{ padding: "4px 12px" }}>
            <button
              className="update-btn"
              style={{ width: "80px" }}
              onClick={() => onFormSubmit()}
            >
              Submit
            </button>
          </div> */}
        </div>
      </div>
    </Drawer>
  );
}

export default Forms;
