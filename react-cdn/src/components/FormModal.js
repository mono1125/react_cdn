import React from "react";

export const FormModal = (props) => {
  console.log(props);
  const active = props.mdlIsDisplay ? "is-active" : "";
  const okBtnHandler = async () => {
    props.setMdlOkBtn(true);
    props.setMdlIsDisplay(false);
    console.log(`Modal Ok Btn handler`);
    await props.submit();
  };
  const cancelBtnHandler = () => {
    props.setMdlCancelBtn(true);
    props.setMdlIsDisplay(false);
    console.log(`Modal Cancel Btn handler`);
  };
  return (
    <>
      <div className={`modal ${active}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">送信確認</p>
            <button
              className="delete"
              aria-label="close"
              onClick={cancelBtnHandler}
            ></button>
          </header>
          <section
            className="modal-card-body"
            style={{ whiteSpace: "pre-wrap" }}
          >
            <p>{props.mdlMessage}</p>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-link"
              onClick={okBtnHandler}
              disabled={!props.mdlOkBtnFlg}
            >
              送信する
            </button>
            <button className="button" onClick={cancelBtnHandler}>
              キャンセル
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};
