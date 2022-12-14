import React, { useState } from "react";
import { FormModal } from "./FormModal";
import { Notification } from "./Notification";

export const Form = () => {
  // フォームデータの初期値
  const defaultValuesOfFormData = {
    boardName: "Unselected",
    deviceId: 0,
    macAddress: "",
    localIpAddress: "",
    localSubnetMaskAddress: "",
    localGatewayAddress: "",
    useDhcp: false,
    wifiSsid: "",
    wifiPass: "",
    otherIpAddress: "",
    otherPortNum: 0,
    advancedSettingsFlg: false,
    numOfSample: 256,
    averageTimes: 16,
    transmissionIntervalMs: 10000,
  };
  const [formData, setFormData] = useState(defaultValuesOfFormData);

  // 送信ボタンの状態
  const [isLoading, setIsLoading] = useState(false);
  // モーダル状態
  const [mdlIsDisplay, setMdlIsDisplay] = useState(false);
  const [mdlMessage, setMdlMessage] = useState("");
  const [mdlOkBtnFlg, setMdlOkBtnFlg] = useState(false);
  const [mdlOkBtn, setMdlOkBtn] = useState(false);
  const [mdlCancelBtn, setMdlCancelBtn] = useState(false);
  // 通知の状態
  const [ntfIsDisplay, setNtfIsDisplay] = useState(false);
  const [ntfMessage, setNtfMessage] = useState({
    title: "",
    statusCode: 0,
    body: "",
    color: "",
  });

  // Advanced Settings用
  const numOfSampleOptions = [];
  const averageTimesOptions = [];
  for (let i = 5; i < 13; i++) {
    const tmp = 2 ** i;
    numOfSampleOptions.push({
      value: tmp,
      label: String(tmp),
    });
  }
  for (let i = 0; i < 8; i++) {
    const tmp = 2 ** i;
    averageTimesOptions.push({
      value: tmp,
      label: String(tmp),
    });
  }

  // デフォルト値
  const defaultValuesOfError = {
    boardName: "",
    deviceId: "",
    macAddress: "",
    localIpAddress: "",
    localSubnetMaskAddress: "",
    localGatewayAddress: "",
    useDhcp: "",
    wifiSsid: "",
    wifiPass: "",
    otherIpAddress: "",
    otherPortNum: "",
    advancedSettingsFlg: "",
    numOfSample: "",
    averageTimes: "",
    transmissionIntervalMs: "",
  };
  // バリデーションチェック結果のエラーメッセージ格納
  const [errorOfData, setErrorOfData] = useState(defaultValuesOfError);

  // バリデーションチェック関数
  const validation = (name, value) => {
    let check = "";
    switch (name) {
      case "boardName":
        switch (value) {
          case "Unselected":
            console.log("ボードを選択してください");
            return [name, "ボードを選択してください"];
          case "ESP32":
            console.log("ESP32が選択されました");
            return [name, ""];
          case "RasberryPi pico":
            console.log("RasberryPi picoが選択されました");
            return [name, ""];
          default:
            console.log("不明なエラー");
            return [name, "不明なエラー"];
        }
      case "deviceId":
        // デバイスIDのバリデーションチェックを行う
        check = /^([0-9]|[1-9][0-9])$/.test(value)
          ? ""
          : "0-99の間で入力してください";
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "macAddress":
        // MACアドレスのバリデーションチェックを行う
        if (formData.boardName === defaultValuesOfFormData.boardName) {
          check = "ボードを選択してください";
        } else if (formData.boardName === "RasberryPi pico") {
          check = /(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}/.test(value)
            ? ""
            : "コロンを使用した形式で入力してください";
        } else if (formData.boardName === "ESP32") {
          check = "";
        } else {
          check = "不明なエラー";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "localIpAddress":
        // 自局IPアドレスのバリデーションチェックを行う
        // 他局IPアドレスと一致していないことを確認
        check =
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
            value
          )
            ? ""
            : "形式に誤りがあります";
        if (formData.otherIpAddress === value) {
          check = "他局IPアドレスと被っています";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "localSubnetMaskAddress":
        // 自局サブネットマスクのバリデーションチェックを行う
        check =
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
            value
          )
            ? ""
            : "形式に誤りがあります";
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "localGatewayAddress":
        // 自局ゲートウェイのバリデーションチェックを行う
        if (value) {
          check =
            /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
              value
            )
              ? ""
              : "形式に誤りがあります";
        } else {
          // ゲートウェイは省略可能
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "useDhcp":
        // DHCPを使うかどうかのバリデーションチェックを行う
        check = /^(true|false)$/.test(String(value))
          ? ""
          : "形式に誤りがあります";
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "wifiSsid":
        // Wi-FiのSSIDのバリデーションチェックを行う
        if (formData.boardName !== "RasberryPi pico") {
          check = /^[!-~]{1,32}$/.test(String(value))
            ? ""
            : "ASCIIで32文字以内で入力してください。";
        } else {
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "wifiPass":
        // Wi-Fiのパスワードのバリデーションチェックを行う
        if (formData.boardName !== "RasberryPi pico") {
          check = /^[!-~]{1,100}$/.test(String(value))
            ? ""
            : "ASCIIで100文字以内で入力してください。";
        } else {
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "otherIpAddress":
        // 他局IPアドレスのバリデーションチェックを行う
        check =
          /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
            value
          )
            ? ""
            : "形式に誤りがあります";
        if (formData.localIpAddress === value) {
          check = "自局IPアドレスと被っています";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "otherPortNum":
        // 他局ポート番号のバリデーションチェックを行う
        check = /^50[0-1][0-9]{2}$/.test(value)
          ? ""
          : "50000-50199の範囲で入力してください";
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "advancedSettingsFlg":
        // Advanced Settingsフラグのバリデーションチェックを行う
        check = /^(true|false)$/.test(String(value))
          ? ""
          : "形式に誤りがあります";
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "numOfSample":
        // サンプル数のバリデーションチェックを行う (required: advanced Settings Flg is True)
        if (formData.advancedSettingsFlg) {
          check = /^(32|64|128|256|512|1024|2048|4096)$/
            ? ""
            : "形式に誤りがあります";
        } else if (
          String(formData.numOfSample) !==
          String(defaultValuesOfFormData.numOfSample)
        ) {
          check = "Advanced Settingsが有効になっていません";
        } else {
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "averageTimes":
        // 平均回数のバリデーションチェックを行う (required: advanced Settings Flg is True)
        if (formData.advancedSettingsFlg) {
          check = /^(1|2|4|8|16|32|64|128)$/ ? "" : "形式に誤りがあります";
        } else if (
          String(formData.averageTimes) !==
          String(defaultValuesOfFormData.averageTimes)
        ) {
          check = "Advanced Settingsが有効になっていません";
        } else {
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} error: ${check}`
        );
        return [name, check];
      case "transmissionIntervalMs":
        // 送信間隔のバリデーションチェックを行う (required: advanced Settings)
        // サンプル数に応じて送信間隔の数値チェックを行う
        if (formData.advancedSettingsFlg) {
          if (!/^[0-9]+$/.test(value)) {
            check = "数字で入力してください";
          } else if (Number(value) < 1000) {
            check = "1000ms以上で指定してください";
          } else if (Number(value) > 300000) {
            check = "300000ms（5分）以内で指定してください";
          } else if (Number(value) >= 1000 && Number(value) < 300001) {
            check = "";
          } else {
            check = "不明なエラー";
          }
        } else if (
          String(formData.transmissionIntervalMs) !==
          String(defaultValuesOfFormData.transmissionIntervalMs)
        ) {
          check = "Advanced Settingsが有効になっていません";
        } else {
          check = "";
        }
        console.log(
          `(validation check) name: ${name} value: ${value} typeOfValue: ${typeof value} error: ${check}`
        );
        return [name, check];
      default:
        console.log("例外エラー");
        return ["default", "例外エラー"];
    }
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name; // inputにname属性必要
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`(handle input Change) name: ${name}, value:${value}`);
  };
  const handleInputBlur = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const [resKey, resValue] = validation(name, value);
    setErrorOfData({ ...errorOfData, [resKey]: resValue });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // 送信しますか？のモーダルを出す
    // バリデーションチェック
    let resObj = {};
    let resValueArray = [];
    for (const [name, value] of Object.entries(formData)) {
      const [resKey, resValue] = validation(name, value);
      resObj = { ...resObj, [resKey]: resValue };
      if (resValue) {
        resValueArray.push(resValue);
      }
    }
    const result = resValueArray.length;
    setErrorOfData({ ...errorOfData, ...resObj });
    console.log(result);
    let message = "";
    let okBtnFlg = false;
    if (result !== 0) {
      console.log("handle is submit: result !== 0");
      console.log(resObj);
      message = ` 入力内容に誤りがあります。\n 修正してください`;
      okBtnFlg = false;
    } else {
      // バリデーションチェックOKなら送信ボタンが押せる
      // 送信はFormModalコンポネントから行う
      message = "送信しますか？";
      okBtnFlg = true;
    }
    setMdlMessage(message);
    setMdlOkBtnFlg(okBtnFlg);
    setMdlIsDisplay(true);
  };

  const resetForm = async () => {
    // フォームPOST後にフォームをリセットする
    setFormData(defaultValuesOfFormData);
    setErrorOfData(defaultValuesOfError);
  };
  // モーダルでOKボタンが押されたあとに実行される送信処理
  const submit = async () => {
    const url = "http://127.0.0.1:3000/api/post";
    let title = "";
    let statusCode = 0;
    let message = "";
    let color = "";
    setMdlOkBtnFlg(false);
    setIsLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(formData),
      });
      statusCode = res.status;
      console.log(`status code: ${statusCode}`);
      if (!res.ok) {
        console.error("response.ok: ", res.ok);
        console.error("response.status: ", res.status);
        console.error("response.statusText: ", res.statusText);
        throw new Error(res.statusText);
      }
      const jsonRes = await res.json();
      console.log(`POST RESPONSE: ${jsonRes.message}`);
      message = `送信しました。\n【ステータスコード】\n  ${statusCode}\n【サーバからのレスポンス】\n  ${jsonRes.message}`;
      title = "送信成功";
      color = "is-success";
      await resetForm();
    } catch (e) {
      console.log(e);
      message = `送信に失敗しました。\n【ステータスコード】\n  ${statusCode}\n【エラー内容】\n  ${e}`;
      title = "エラー";
      color = "is-danger";
    }
    setNtfMessage({
      title: title,
      statusCode: statusCode,
      body: message,
      color: color,
    });
    setIsLoading(false);
    setNtfIsDisplay(true);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <>
      {mdlIsDisplay && (
        <FormModal
          mdlIsDisplay={mdlIsDisplay}
          mdlMessage={mdlMessage}
          mdlOkBtnFlg={mdlOkBtnFlg}
          submit={submit}
          setMdlIsDisplay={setMdlIsDisplay}
          setMdlOkBtn={setMdlOkBtn}
          setMdlCancelBtn={setMdlCancelBtn}
        />
      )}
      <div className="container box">
        <p className="mt-3 ml-4 is-size-5 has-text-weight-semibold">
          設定フォーム
        </p>
        <form onSubmit={handleSubmit}>
          <div className="columns mt-3 mx-3 is-centered">
            <div className="column is-one-third">
              <div className="field">
                <label className="label">Select Board</label>
                <div className="control">
                  <div className="select">
                    <select
                      name="boardName"
                      value={formData.boardName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                    >
                      <option value="Unselected">-- Select Board --</option>
                      <option value="ESP32">ESP32</option>
                      <option value="RasberryPi pico">RasberryPi pico</option>
                    </select>
                    {errorOfData.boardName && (
                      <span className="has-text-danger-dark">
                        {errorOfData.boardName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-1" />
            <div className="column is-one-third">
              <div className="field">
                <label className="label">Device ID</label>
                <div className="control">
                  <input
                    name="deviceId"
                    className="input"
                    type="number"
                    placeholder="Device ID"
                    max="99"
                    style={{ width: "33%" }}
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={formData.boardName === "Unselected"}
                  />
                </div>
                {errorOfData.deviceId && (
                  <span className="has-text-danger-dark">
                    {errorOfData.deviceId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="columns mx-3 is-centered">
            <div className="column is-one-third">
              {formData.boardName === "RasberryPi pico" && (
                <div className="field">
                  <label className="label">Macアドレス</label>
                  <div className="control">
                    <input
                      name="macAddress"
                      className="input"
                      type="text"
                      placeholder="Text input"
                      value={formData.macAddress}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyPress={handleKeyPress}
                      disabled={formData.boardName === "Unselected"}
                    />
                    {errorOfData.macAddress && (
                      <span className="has-text-danger-dark">
                        {errorOfData.macAddress}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="field">
                <label className="label">自局IPアドレス</label>
                <div className="control">
                  <input
                    name="localIpAddress"
                    className="input"
                    type="text"
                    placeholder="Text input"
                    value={formData.localIpAddress}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={
                      formData.useDhcp || formData.boardName === "Unselected"
                    }
                  />
                  {errorOfData.localIpAddress && (
                    <span className="has-text-danger-dark">
                      {errorOfData.localIpAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="label">自局サブネットマスク</label>
                <div className="control">
                  <input
                    name="localSubnetMaskAddress"
                    className="input"
                    type="text"
                    placeholder="Text input"
                    value={formData.localSubnetMaskAddress}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={
                      formData.useDhcp || formData.boardName === "Unselected"
                    }
                  />
                  {errorOfData.localSubnetMaskAddress && (
                    <span className="has-text-danger-dark">
                      {errorOfData.localSubnetMaskAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="label">
                  自局ゲートウェイアドレス（省略可能）
                </label>
                <div className="control">
                  <input
                    name="localGatewayAddress"
                    className="input"
                    type="text"
                    placeholder="Text input"
                    value={formData.localGatewayAddress}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={
                      formData.useDhcp || formData.boardName === "Unselected"
                    }
                  />
                  {errorOfData.localGatewayAddress && (
                    <span className="has-text-danger-dark">
                      {errorOfData.localGatewayAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      name="useDhcp"
                      type="checkbox"
                      value={formData.useDhcp}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyPress={handleKeyPress}
                      disabled={formData.boardName === "Unselected"}
                    />
                    <span className="ml-2 is-size-6">DHCPを使用する</span>
                    {formData.boardName === "ESP32" && (
                      <span className="ml-1 has-text-warning-dark">
                        （ESP32非推奨）
                      </span>
                    )}
                  </label>
                </div>
                {errorOfData.useDhcp && (
                  <span className="has-text-danger-dark">
                    {errorOfData.useDhcp}
                  </span>
                )}
              </div>
            </div>
            <div className="column is-1" />

            <div className="column is-one-third">
              <div className="field">
                <label className="label">他局IPアドレス</label>
                <div className="control">
                  <input
                    name="otherIpAddress"
                    className="input"
                    type="text"
                    placeholder="Text input"
                    value={formData.otherIpAddress}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={formData.boardName === "Unselected"}
                  />
                  {errorOfData.otherIpAddress && (
                    <span className="has-text-danger-dark">
                      {errorOfData.otherIpAddress}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="label">他局ポート番号</label>
                <div className="control">
                  <input
                    name="otherPortNum"
                    className="input"
                    type="number"
                    placeholder="Number input"
                    style={{ width: "33%" }}
                    value={formData.otherPortNum}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    disabled={formData.boardName === "Unselected"}
                  />
                </div>
                {errorOfData.otherPortNum && (
                  <span className="has-text-danger-dark">
                    {errorOfData.otherPortNum}
                  </span>
                )}
              </div>

              {formData.boardName === "ESP32" && (
                <>
                  <div className="field">
                    <label className="label">Wi-Fi SSID</label>
                    <div className="control">
                      <input
                        name="wifiSsid"
                        className="input"
                        type="text"
                        placeholder="Text input"
                        value={formData.wifiSsid}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyPress={handleKeyPress}
                      />
                      {errorOfData.wifiSsid && (
                        <span className="has-text-danger-dark">
                          {errorOfData.wifiSsid}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Wi-Fi Password</label>
                    <div className="control">
                      <input
                        name="wifiPass"
                        className="input"
                        type="text"
                        placeholder="Text input"
                        value={formData.wifiPass}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyPress={handleKeyPress}
                      />
                      {errorOfData.wifiPass && (
                        <span className="has-text-danger-dark">
                          {errorOfData.wifiPass}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      name="advancedSettingsFlg"
                      type="checkbox"
                      value={formData.advancedSettingsFlg}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyPress={handleKeyPress}
                      disabled={formData.boardName === "Unselected"}
                    />
                    <span className="ml-2 is-size-6">
                      Enable Advanced Settings
                    </span>
                  </label>
                  {errorOfData.advancedSettingsFlg && (
                    <span className="has-text-danger-dark">
                      {errorOfData.advancedSettingsFlg}
                    </span>
                  )}
                </div>
              </div>

              {formData.advancedSettingsFlg && (
                <>
                  <div className="field">
                    <label className="label">サンプル数 N</label>
                    <div className="control">
                      <div className="select">
                        <select
                          name="numOfSample"
                          value={formData.numOfSample}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                        >
                          {numOfSampleOptions.map(({ value, label }, index) => (
                            <option key={index} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {errorOfData.numOfSample && (
                      <span className="has-text-danger-dark">
                        {errorOfData.numOfSample}
                      </span>
                    )}
                  </div>
                  <div className="field">
                    <label className="label">平均回数 N</label>
                    <div className="control">
                      <div className="select">
                        <select
                          name="averageTimes"
                          value={formData.averageTimes}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                        >
                          {averageTimesOptions.map(
                            ({ value, label }, index) => (
                              <option key={index} value={value}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    {errorOfData.averageTimes && (
                      <span className="has-text-danger-dark">
                        {errorOfData.averageTimes}
                      </span>
                    )}
                  </div>
                  <div className="field">
                    <label className="label">データ送信間隔 (millisec)</label>
                    <div className="control">
                      <input
                        name="transmissionIntervalMs"
                        className="input"
                        type="number"
                        placeholder="Number input"
                        style={{ width: "50%" }}
                        value={formData.transmissionIntervalMs}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    {errorOfData.transmissionIntervalMs && (
                      <span className="has-text-danger-dark">
                        {errorOfData.transmissionIntervalMs}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="columns mx-3 is-centered">
            <div className="column is-one-fifth">
              <div className="field mt-3 mb-3 ml-4">
                <div className="control">
                  {isLoading ? (
                    <button className="button is-link is-loading">送信</button>
                  ) : (
                    <button
                      className="button is-link"
                      onClick={handleSubmit}
                      disabled={formData.boardName === "Unselected"}
                    >
                      送信
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="column is-1" />
            <div className="column is-half" />
          </div>
        </form>
      </div>
      {ntfIsDisplay && (
        <Notification
          setNtfIsDisplay={setNtfIsDisplay}
          ntfMessage={ntfMessage}
        />
      )}
    </>
  );
};
