import React, { useState, useEffect } from "react";
import { Notification } from "./Notification";

export const CurrentSettings = () => {
  // 現在の設定値を取得して表示する
  // 取得時刻の表示、更新ボタンの実装
  const [data, setData] = useState({
    settings: {},
    statusCode: 0,
    message: "",
    time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ntfIsDisplay, setNtfIsDisplay] = useState(false);
  const [ntfMessage, setNtfMessage] = useState({
    title: "",
    body: "",
    color: "",
  });
  const getDate = async () => {
    const d = new Date();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hour = ("0" + d.getHours()).slice(-2);
    const min = ("0" + d.getMinutes()).slice(-2);
    const sec = ("0" + d.getSeconds()).slice(-2);
    return `${d.getFullYear()}/${month}/${day} ${hour}:${min}:${sec}`;
  };

  const getSettings = async () => {
    const url = "http://127.0.0.1:3000/api/get";
    let jsonRes = {};
    let statusCode = 0;
    let message = "";
    let isDisplay = false;
    let title = "";
    let color = "";
    setIsLoading(true);
    const time = await getDate();
    try {
      const res = await fetch(url);
      jsonRes = await res.json();
      statusCode = res.status;
      if (!res.ok) {
        console.error("response.ok: ", res.ok);
        console.error("response.status: ", res.status);
        console.error("response.statusText: ", res.statusText);
        throw new Error(res.statusText);
      }
      message = `データを取得しました。\n【ステータスコード】\n  ${statusCode}`;
      console.log(jsonRes);
    } catch (e) {
      console.log(e);
      isDisplay = true;
      color = "is-danger";
      title = "エラー";
      message = `データの取得に失敗しました。\n【ステータスコード】\n  ${statusCode}\n【エラー内容】\n  ${e}`;
    }
    setData({
      settings: { ...jsonRes },
      statusCode: statusCode,
      message: message,
      time: time,
    });
    setNtfIsDisplay(isDisplay);
    setNtfMessage({
      title: title,
      body: message,
      color: color,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getSettings();
  }, []);

  const onBtnClick = () => {
    getSettings();
  };
  return (
    <>
      <div className="container box">
        <span
          className="mt-4 ml-4 is-size-5 has-text-weight-semibold"
          style={{ verticalAlign: "middle" }}
        >
          現在の設定値
        </span>
        {isLoading ? (
          <button
            className="button is-info is-outlined ml-4 is-loading"
            style={{ verticalAlign: "middle" }}
          >
            更新
          </button>
        ) : (
          <button
            className="button is-info is-outlined ml-4"
            style={{ verticalAlign: "middle" }}
            onClick={onBtnClick}
          >
            更新
          </button>
        )}
        <p className="mt-2 ml-4">取得時刻: {data.time}</p>
        <div className="columns mt-3 mx-3 is-centered">
          <div className="column is-1" />
          <div className="column is-one-third">
            <p className="has-text-weight-bold">Board</p>
            <p>{data.settings.boardName}</p>
          </div>
          <div className="column is-one-third">
            <p className="has-text-weight-bold">Device ID</p>
            <p>{data.settings.deviceId}</p>
          </div>
          <div className="column is-one-third"></div>
        </div>
        <div className="columns mt-3 mx-3 mb-4 is-centered">
          <div className="column is-1" />
          <div className="column is-one-third">
            {data.settings.boardName === "RasberryPi pico" ? (
              <>
                <p className="has-text-weight-bold">Macアドレス</p>
                {data.settings.macAddress ? (
                  <p className="mb-4">{data.settings.macAddress}</p>
                ) : (
                  <p className="mb-4">-----</p>
                )}
              </>
            ) : (
              ""
            )}
            <p className="has-text-weight-bold">自局IPアドレス</p>
            <p>{data.settings.localIpAddress}</p>
            <p className="has-text-weight-bold mt-4">自局サブネットマスク</p>
            <p>{data.settings.localSubnetMaskAddress}</p>
            <p className="has-text-weight-bold mt-4">
              自局ゲートウェイアドレス
            </p>
            {data.settings.localGatewayAddress ? (
              <p>{data.settings.localGatewayAddress}</p>
            ) : (
              <p>-----</p>
            )}
            <p className="has-text-weight-bold mt-4">DHCPを使用するか</p>
            {data.settings.useDhcp ? <p>使用する</p> : <p>使用しない</p>}
          </div>
          <div className="column is-one-third">
            <p className="has-text-weight-bold">他局IPアドレス</p>
            <p>{data.settings.otherIpAddress}</p>
            <p className="has-text-weight-bold mt-4">ポート番号</p>
            <p>{data.settings.otherIpAddress}</p>
            {data.settings.boardName !== "RasberryPi pico" ? (
              <>
                <p className="has-text-weight-bold mt-4">Wi-Fi SSID</p>
                {data.settings.wifiSsid ? (
                  <p>{data.settings.wifiSsid}</p>
                ) : (
                  <p>-----</p>
                )}
                <p className="has-text-weight-bold mt-4">Wi-Fi Password</p>
                {data.settings.wifiPass ? (
                  <p>{data.settings.wifiPass}</p>
                ) : (
                  <p>-----</p>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className="column is-one-third">
            <p className="has-text-weight-bold">Advanced Settingsが有効か</p>
            {data.settings.advancedSettingsFlg ? <p>有効</p> : <p>無効</p>}
            <p className="has-text-weight-bold mt-4">
              サンプル数 N{" "}
              {data.settings.advancedSettingsFlg ? "" : <span>（既定値）</span>}
            </p>
            <p>{data.settings.numOfSample}</p>
            <p className="has-text-weight-bold mt-4">
              平均回数{" "}
              {data.settings.advancedSettingsFlg ? "" : <span>（既定値）</span>}
            </p>
            <p>{data.settings.averageTimes}</p>
            <p className="has-text-weight-bold mt-4">
              送信間隔 (ms){" "}
              {data.settings.advancedSettingsFlg ? "" : <span>（既定値）</span>}
            </p>
            <p>{data.settings.transmissionIntervalMs}</p>
          </div>
        </div>
      </div>
      {ntfIsDisplay && (
        <Notification
          ntfMessage={ntfMessage}
          setNtfIsDisplay={setNtfIsDisplay}
        />
      )}
    </>
  );
};
