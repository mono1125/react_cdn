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
      statusCode = res.status;
      if (!res.ok) {
        console.error("response.ok: ", res.ok);
        console.error("response.status: ", res.status);
        console.error("response.statusText: ", res.statusText);
        throw new Error(res.statusText);
      }
      jsonRes = await res.json();
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
          data-testid="current-settings-title"
        >
          現在の設定値
        </span>
        {isLoading ? (
          <button
            className="button is-info is-outlined ml-4 is-loading"
            style={{ verticalAlign: "middle" }}
            data-testid="update-btn-loading"
          >
            更新
          </button>
        ) : (
          <button
            className="button is-info is-outlined ml-4"
            style={{ verticalAlign: "middle" }}
            onClick={onBtnClick}
            data-testid="update-btn"
          >
            更新
          </button>
        )}
        <p className="mt-2 ml-4" data-testid="get-time">
          取得時刻: {data.time}
        </p>
        <div className="columns mt-3 mx-3 is-centered">
          <div className="column is-1" />
          <div className="column is-one-third">
            <p className="has-text-weight-bold" data-testid="label-board">
              Board
            </p>
            {data.settings.boardName ? (
              <p data-testid="data-board">{data.settings.boardName}</p>
            ) : (
              <p data-testid="data-board-nodata">-----</p>
            )}
          </div>
          <div className="column is-one-third">
            <p className="has-text-weight-bold" data-testid="label-deviceid">
              Device ID
            </p>
            {typeof data.settings.deviceId !== "undefined" ? (
              <p data-testid="data-deviceid">{data.settings.deviceId}</p>
            ) : (
              <p data-testid="data-deviceid-nodata">-----</p>
            )}
          </div>
          <div className="column is-one-third"></div>
        </div>
        <div className="columns mt-3 mx-3 mb-4 is-centered">
          <div className="column is-1" />
          <div className="column is-one-third">
            {data.settings.boardName === "RasberryPi pico" ? (
              <>
                <p
                  className="has-text-weight-bold"
                  data-testid="label-mac-address"
                >
                  Macアドレス
                </p>
                {data.settings.macAddress ? (
                  <p className="mb-4" data-testid="data-mac-address">
                    {data.settings.macAddress}
                  </p>
                ) : (
                  <p className="mb-4" data-testid="data-mac-address-nodata">
                    -----
                  </p>
                )}
              </>
            ) : (
              ""
            )}
            <p
              className="has-text-weight-bold"
              data-testid="label-local-ipaddress"
            >
              自局IPアドレス
            </p>
            {data.settings.localIpAddress ? (
              <p data-testid="data-local-ipaddress">
                {data.settings.localIpAddress}
              </p>
            ) : (
              <p data-testid="data-local-ipaddress-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-local-subnetmask"
            >
              自局サブネットマスク
            </p>
            {data.settings.localSubnetMaskAddress ? (
              <p data-testid="data-local-subnetmask">
                {data.settings.localSubnetMaskAddress}
              </p>
            ) : (
              <p data-testid="data-local-subnetmask-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-local-gatewayaddress"
            >
              自局ゲートウェイアドレス
            </p>
            {data.settings.localGatewayAddress ? (
              <p data-testid="data-local-gatewayaddress">
                {data.settings.localGatewayAddress}
              </p>
            ) : (
              <p data-testid="data-local-gatewayaddress-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-use-dhcp"
            >
              DHCPを使用するか
            </p>
            {data.settings.useDhcp ? (
              <p data-testid="data-use-dhcp">使用する</p>
            ) : (
              <p data-testid="data-not-use-dhcp">使用しない</p>
            )}
          </div>
          <div className="column is-one-third">
            <p
              className="has-text-weight-bold"
              data-testid="label-other-ipaddress"
            >
              他局IPアドレス
            </p>
            {data.settings.otherIpAddress ? (
              <p data-testid="data-other-ipaddress">
                {data.settings.otherIpAddress}
              </p>
            ) : (
              <p data-testid="data-other-ipaddress-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-other-portnum"
            >
              ポート番号
            </p>
            {data.settings.otherPortNum ? (
              <p data-testid="data-other-portnum">
                {data.settings.otherPortNum}
              </p>
            ) : (
              <p data-testid="data-other-portnum-nodata">-----</p>
            )}
            {data.settings.boardName !== "RasberryPi pico" ? (
              <>
                <p
                  className="has-text-weight-bold mt-4"
                  data-testid="label-wifi-ssid"
                >
                  Wi-Fi SSID
                </p>
                {data.settings.wifiSsid ? (
                  <p data-testid="data-wifi-ssid">{data.settings.wifiSsid}</p>
                ) : (
                  <p data-testid="data-wifi-ssid-nodata">-----</p>
                )}
                <p
                  className="has-text-weight-bold mt-4"
                  data-testid="label-wifi-pass"
                >
                  Wi-Fi Password
                </p>
                {data.settings.wifiPass ? (
                  <p data-testid="data-wifi-pass">{data.settings.wifiPass}</p>
                ) : (
                  <p data-testid="data-wifi-pass-nodata">-----</p>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className="column is-one-third">
            <p
              className="has-text-weight-bold"
              data-testid="label-advanced-settings"
            >
              Advanced Settingsが有効か
            </p>
            {data.settings.advancedSettingsFlg ? (
              <p data-testid="data-advanced-settings">有効</p>
            ) : (
              <p data-testid="data-advanced-settings-false">無効</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-num-of-sample"
            >
              サンプル数 N{" "}
              {data.settings.advancedSettingsFlg ? (
                ""
              ) : (
                <span data-testid="label-num-of-sample-default">
                  （既定値）
                </span>
              )}
            </p>
            {data.settings.numOfSample ? (
              <p data-testid="data-num-of-sample">
                {data.settings.numOfSample}
              </p>
            ) : (
              <p data-testid="data-num-of-sample-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-average-times"
            >
              平均回数{" "}
              {data.settings.advancedSettingsFlg ? (
                ""
              ) : (
                <span data-testid="label-average-times-default">
                  （既定値）
                </span>
              )}
            </p>
            {data.settings.averageTimes ? (
              <p data-testid="data-average-times">
                {data.settings.averageTimes}
              </p>
            ) : (
              <p data-testid="data-average-times-nodata">-----</p>
            )}
            <p
              className="has-text-weight-bold mt-4"
              data-testid="label-transmission-interval"
            >
              送信間隔 (ms){" "}
              {data.settings.advancedSettingsFlg ? (
                ""
              ) : (
                <span data-testid="label-transmission-interval-default">
                  （既定値）
                </span>
              )}
            </p>
            {data.settings.transmissionIntervalMs ? (
              <p data-testid="data-transmission-interval">
                {data.settings.transmissionIntervalMs}
              </p>
            ) : (
              <p data-testid="data-transmission-interval-nodata">-----</p>
            )}
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
