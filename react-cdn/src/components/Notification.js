import React from "react";

export const Notification = (props) => {
  console.log(props);
  const onDelete = () => {
    props.setNtfIsDisplay(false);
    console.log("FormNotification false");
    console.log(props.ntfMessage.title);
    console.log(props.ntfMessage.body);
  };
  return (
    <div className="container mb-6">
      <article className={`message ${props.ntfMessage.color}`}>
        <div className="message-header">
          <p className="ml-4">{props.ntfMessage.title}</p>
          <button
            className="delete"
            aria-label="delete"
            onClick={onDelete}
          ></button>
        </div>
        <div className="message-body" style={{ whiteSpace: "pre-wrap" }}>
          {props.ntfMessage.body}
        </div>
      </article>
    </div>
  );
};
