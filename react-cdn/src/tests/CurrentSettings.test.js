import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { CurrentSettings } from "../components/CurrentSettings";

const handlers = [
  rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        boardName: "ESP32",
        deviceId: 0,
        macAddress: "",
        localIpAddress: "192.168.1.100",
        localSubnetMaskAddress: "255.255.255.0",
        localGatewayAddress: "",
        useDhcp: false,
        wifiSsid: "testap",
        wifiPass: "testpass",
        otherIpAddress: "192.168.1.1",
        otherPortNum: "50000",
        advancedSettingsFlg: false,
        numOfSample: 256,
        averageTimes: 16,
        transmissionIntervalMs: 10000,
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe("CurrentSettings Component Test Cases", () => {
  it("1 :Should render all the elements correctly (ESP32)", async () => {
    render(<CurrentSettings />);
    // "現在の設定値" が表示されているか
    expect(screen.getByTestId("current-settings-title").textContent).toBe(
      "現在の設定値"
    );
    // "更新ボタンが表示されているか"
    //// 読み込み中
    expect(await screen.findByTestId("update-btn-loading")).toBeTruthy();
    //// 読み込み完了後
    expect(await screen.findByTestId("update-btn")).toBeTruthy();
    // "取得時刻" が表示されているか
    expect(screen.getByTestId("get-time")).toBeTruthy();
    // screen.debug();
    expect(screen.getByTestId("label-board")).toBeTruthy();
    expect(screen.getByTestId("data-board")).toBeTruthy();
    expect(screen.getByTestId("label-deviceid")).toBeTruthy();
    expect(screen.getByTestId("data-deviceid")).toBeTruthy();
    expect(screen.queryByTestId("label-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address-nodata")).toBeNull();
    expect(screen.getByTestId("label-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("data-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("label-local-gatewayaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-gatewayaddress")).toBeNull();
    expect(screen.getByTestId("data-local-gatewayaddress-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-use-dhcp")).toBeTruthy();
    expect(screen.queryByTestId("data-use-dhcp")).toBeNull();
    expect(screen.getByTestId("data-not-use-dhcp")).toBeTruthy();
    expect(screen.getByTestId("label-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("data-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("label-wifi-ssid")).toBeTruthy();
    expect(screen.getByTestId("data-wifi-ssid")).toBeTruthy();
    expect(screen.getByTestId("label-wifi-pass")).toBeTruthy();
    expect(screen.getByTestId("data-wifi-pass")).toBeTruthy();
    expect(screen.queryByTestId("data-wifi-pass-nodata")).toBeNull();
    expect(screen.getByTestId("label-advanced-settings")).toBeTruthy();
    expect(screen.queryByTestId("data-advanced-settings")).toBeNull();
    expect(screen.getByTestId("data-advanced-settings-false")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample-default")).toBeTruthy();
    expect(screen.getByTestId("data-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-average-times-default")).toBeTruthy();
    expect(screen.getByTestId("data-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-transmission-interval")).toBeTruthy();
    expect(
      screen.getByTestId("label-transmission-interval-default")
    ).toBeTruthy();
    expect(screen.getByTestId("data-transmission-interval")).toBeTruthy();
  });
  it("2 :Should render all the elements correctly (ESP32, other params)", async () => {
    // 取得したパラメタが異なる場合
    server.use(
      rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            boardName: "ESP32",
            deviceId: 0,
            macAddress: "",
            localIpAddress: "192.168.1.100",
            localSubnetMaskAddress: "255.255.255.0",
            localGatewayAddress: "192.168.1.1",
            useDhcp: true,
            wifiSsid: "testap",
            wifiPass: "testpass",
            otherIpAddress: "192.168.1.1",
            otherPortNum: "50000",
            advancedSettingsFlg: true,
            numOfSample: 128,
            averageTimes: 8,
            transmissionIntervalMs: 12000,
          })
        );
      })
    );
    render(<CurrentSettings />);
    expect(await screen.findByTestId("update-btn-loading")).toBeTruthy();
    expect(await screen.findByTestId("update-btn")).toBeTruthy();
    expect(screen.getByTestId("get-time")).toBeTruthy();
    // screen.debug();
    expect(screen.getByTestId("label-board")).toBeTruthy();
    expect(screen.getByTestId("data-board")).toBeTruthy();
    expect(screen.getByTestId("label-deviceid")).toBeTruthy();
    expect(screen.getByTestId("data-deviceid")).toBeTruthy();
    expect(screen.queryByTestId("label-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address-nodata")).toBeNull();
    expect(screen.getByTestId("label-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("data-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("label-local-gatewayaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-gatewayaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-gatewayaddress-nodata")).toBeNull();
    expect(screen.getByTestId("label-use-dhcp")).toBeTruthy();
    expect(screen.getByTestId("data-use-dhcp")).toBeTruthy();
    expect(screen.queryByTestId("data-not-use-dhcp")).toBeNull();
    expect(screen.getByTestId("label-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("data-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("label-wifi-ssid")).toBeTruthy();
    expect(screen.getByTestId("data-wifi-ssid")).toBeTruthy();
    expect(screen.getByTestId("label-wifi-pass")).toBeTruthy();
    expect(screen.getByTestId("data-wifi-pass")).toBeTruthy();
    expect(screen.queryByTestId("data-wifi-pass-nodata")).toBeNull();
    expect(screen.getByTestId("label-advanced-settings")).toBeTruthy();
    expect(screen.getByTestId("data-advanced-settings")).toBeTruthy();
    expect(screen.queryByTestId("data-advanced-settings-false")).toBeNull();
    expect(screen.getByTestId("label-num-of-sample")).toBeTruthy();
    expect(screen.queryByTestId("label-num-of-sample-default")).toBeNull();
    expect(screen.getByTestId("data-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-average-times")).toBeTruthy();
    expect(screen.queryByTestId("label-average-times-default")).toBeNull();
    expect(screen.getByTestId("data-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-transmission-interval")).toBeTruthy();
    expect(
      screen.queryByTestId("label-transmission-interval-default")
    ).toBeNull();
    expect(screen.getByTestId("data-transmission-interval")).toBeTruthy();
  });
  it("3 :Should render all the elements correctly (RasberryPi pico)", async () => {
    server.use(
      rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            boardName: "RasberryPi pico",
            deviceId: 0,
            macAddress: "0b:7c:a3:da:34:37",
            localIpAddress: "192.168.1.100",
            localSubnetMaskAddress: "255.255.255.0",
            localGatewayAddress: "",
            useDhcp: false,
            wifiSsid: "",
            wifiPass: "",
            otherIpAddress: "192.168.1.1",
            otherPortNum: "50000",
            advancedSettingsFlg: false,
            numOfSample: 256,
            averageTimes: 16,
            transmissionIntervalMs: 10000,
          })
        );
      })
    );
    render(<CurrentSettings />);
    // "現在の設定値" が表示されているか
    expect(screen.getByTestId("current-settings-title").textContent).toBe(
      "現在の設定値"
    );
    expect(await screen.findByTestId("update-btn-loading")).toBeTruthy();
    expect(await screen.findByTestId("update-btn")).toBeTruthy();
    expect(screen.getByTestId("get-time")).toBeTruthy();
    // screen.debug();
    expect(screen.getByTestId("label-board")).toBeTruthy();
    expect(screen.getByTestId("data-board")).toBeTruthy();
    expect(screen.getByTestId("label-deviceid")).toBeTruthy();
    expect(screen.getByTestId("data-deviceid")).toBeTruthy();
    expect(screen.getByTestId("label-mac-address")).toBeTruthy();
    expect(screen.getByTestId("data-mac-address")).toBeTruthy();
    expect(screen.queryByTestId("data-mac-address-nodata")).toBeNull();
    expect(screen.getByTestId("label-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("data-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("label-local-gatewayaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-gatewayaddress")).toBeNull();
    expect(screen.getByTestId("data-local-gatewayaddress-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-use-dhcp")).toBeTruthy();
    expect(screen.queryByTestId("data-use-dhcp")).toBeNull();
    expect(screen.getByTestId("data-not-use-dhcp")).toBeTruthy();
    expect(screen.getByTestId("label-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("data-other-portnum")).toBeTruthy();
    expect(screen.queryByTestId("label-wifi-ssid")).toBeNull();
    expect(screen.queryByTestId("data-wifi-ssid")).toBeNull();
    expect(screen.queryByTestId("label-wifi-pass")).toBeNull();
    expect(screen.queryByTestId("data-wifi-pass")).toBeNull();
    expect(screen.queryByTestId("data-wifi-pass-nodata")).toBeNull();
    expect(screen.getByTestId("label-advanced-settings")).toBeTruthy();
    expect(screen.queryByTestId("data-advanced-settings")).toBeNull();
    expect(screen.getByTestId("data-advanced-settings-false")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample-default")).toBeTruthy();
    expect(screen.getByTestId("data-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-average-times-default")).toBeTruthy();
    expect(screen.getByTestId("data-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-transmission-interval")).toBeTruthy();
    expect(
      screen.getByTestId("label-transmission-interval-default")
    ).toBeTruthy();
    expect(screen.getByTestId("data-transmission-interval")).toBeTruthy();
  });
  it("4 :Should render all the elements correctly (RasberryPi pico, other params)", async () => {
    server.use(
      rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            boardName: "RasberryPi pico",
            deviceId: 0,
            macAddress: "",
            localIpAddress: "192.168.1.100",
            localSubnetMaskAddress: "255.255.255.0",
            localGatewayAddress: "192.168.1.1",
            useDhcp: true,
            wifiSsid: "",
            wifiPass: "",
            otherIpAddress: "192.168.1.1",
            otherPortNum: "50000",
            advancedSettingsFlg: true,
            numOfSample: 128,
            averageTimes: 8,
            transmissionIntervalMs: 12000,
          })
        );
      })
    );
    render(<CurrentSettings />);
    // "現在の設定値" が表示されているか
    expect(screen.getByTestId("current-settings-title").textContent).toBe(
      "現在の設定値"
    );
    expect(await screen.findByTestId("update-btn-loading")).toBeTruthy();
    expect(await screen.findByTestId("update-btn")).toBeTruthy();
    expect(screen.getByTestId("get-time")).toBeTruthy();
    // screen.debug();
    expect(screen.getByTestId("label-board")).toBeTruthy();
    expect(screen.getByTestId("data-board")).toBeTruthy();
    expect(screen.getByTestId("label-deviceid")).toBeTruthy();
    expect(screen.getByTestId("data-deviceid")).toBeTruthy();
    expect(screen.getByTestId("label-mac-address")).toBeTruthy();
    expect(screen.queryByTestId("data-mac-address")).toBeNull();
    expect(screen.getByTestId("data-mac-address-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("data-local-subnetmask")).toBeTruthy();
    expect(screen.getByTestId("label-local-gatewayaddress")).toBeTruthy();
    expect(screen.getByTestId("data-local-gatewayaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-gatewayaddress-nodata")).toBeNull();
    expect(screen.getByTestId("label-use-dhcp")).toBeTruthy();
    expect(screen.getByTestId("data-use-dhcp")).toBeTruthy();
    expect(screen.queryByTestId("data-not-use-dhcp")).toBeNull();
    expect(screen.getByTestId("label-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("data-other-ipaddress")).toBeTruthy();
    expect(screen.getByTestId("label-other-portnum")).toBeTruthy();
    expect(screen.getByTestId("data-other-portnum")).toBeTruthy();
    expect(screen.queryByTestId("label-wifi-ssid")).toBeNull();
    expect(screen.queryByTestId("data-wifi-ssid")).toBeNull();
    expect(screen.queryByTestId("label-wifi-pass")).toBeNull();
    expect(screen.queryByTestId("data-wifi-pass")).toBeNull();
    expect(screen.queryByTestId("data-wifi-pass-nodata")).toBeNull();
    expect(screen.getByTestId("label-advanced-settings")).toBeTruthy();
    expect(screen.getByTestId("data-advanced-settings")).toBeTruthy();
    expect(screen.queryByTestId("data-advanced-settings-false")).toBeNull();
    expect(screen.getByTestId("label-num-of-sample")).toBeTruthy();
    expect(screen.queryByTestId("label-num-of-sample-default")).toBeNull();
    expect(screen.getByTestId("data-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-average-times")).toBeTruthy();
    expect(screen.queryByTestId("label-average-times-default")).toBeNull();
    expect(screen.getByTestId("data-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-transmission-interval")).toBeTruthy();
    expect(
      screen.queryByTestId("label-transmission-interval-default")
    ).toBeNull();
    expect(screen.getByTestId("data-transmission-interval")).toBeTruthy();
  });
  it("5 :Should not render list of data from REST API when rejected", async () => {
    server.use(
      rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    render(<CurrentSettings />);
    expect(await screen.findByTestId("update-btn-loading")).toBeTruthy();
    expect(await screen.findByTestId("update-btn")).toBeTruthy();
    expect(screen.getByTestId("get-time")).toBeTruthy();
    // screen.debug();
    expect(screen.getByTestId("label-board")).toBeTruthy();
    expect(screen.queryByTestId("data-board")).toBeNull();
    expect(screen.getByTestId("data-board-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-deviceid")).toBeTruthy();
    expect(screen.queryByTestId("data-deviceid")).toBeNull();
    expect(screen.getByTestId("data-deviceid-nodata")).toBeTruthy();
    expect(screen.queryByTestId("label-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address")).toBeNull();
    expect(screen.queryByTestId("data-mac-address-nodata")).toBeNull();
    expect(screen.getByTestId("label-local-ipaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-ipaddress")).toBeNull();
    expect(screen.getByTestId("data-local-ipaddress-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-local-subnetmask")).toBeTruthy();
    expect(screen.queryByTestId("data-local-subnetmask")).toBeNull();
    expect(screen.getByTestId("data-local-subnetmask-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-local-gatewayaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-local-gatewayaddress")).toBeNull();
    expect(screen.getByTestId("data-local-gatewayaddress-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-use-dhcp")).toBeTruthy();
    expect(screen.queryByTestId("data-use-dhcp")).toBeNull();
    expect(screen.getByTestId("data-not-use-dhcp")).toBeTruthy();
    expect(screen.getByTestId("label-other-ipaddress")).toBeTruthy();
    expect(screen.queryByTestId("data-other-ipaddress")).toBeNull();
    expect(screen.getByTestId("data-other-ipaddress-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-other-portnum")).toBeTruthy();
    expect(screen.queryByTestId("data-other-portnum")).toBeNull();
    expect(screen.getByTestId("data-other-portnum-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-wifi-ssid")).toBeTruthy();
    expect(screen.queryByTestId("data-wifi-ssid")).toBeNull();
    expect(screen.getByTestId("label-wifi-pass")).toBeTruthy();
    expect(screen.queryByTestId("data-wifi-pass")).toBeNull();
    expect(screen.getByTestId("data-wifi-pass-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-advanced-settings")).toBeTruthy();
    expect(screen.queryByTestId("data-advanced-settings")).toBeNull();
    expect(screen.getByTestId("data-advanced-settings-false")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample")).toBeTruthy();
    expect(screen.getByTestId("label-num-of-sample-default")).toBeTruthy();
    expect(screen.queryByTestId("data-num-of-sample")).toBeNull();
    expect(screen.getByTestId("label-average-times")).toBeTruthy();
    expect(screen.getByTestId("label-average-times-default")).toBeTruthy();
    expect(screen.queryByTestId("data-average-times")).toBeNull();
    expect(screen.getByTestId("data-average-times-nodata")).toBeTruthy();
    expect(screen.getByTestId("label-transmission-interval")).toBeTruthy();
    expect(
      screen.getByTestId("label-transmission-interval-default")
    ).toBeTruthy();
    expect(screen.queryByTestId("data-transmission-interval")).toBeNull();
    expect(
      screen.getByTestId("data-transmission-interval-nodata")
    ).toBeTruthy();
    // 結果の表示は Notification Component
    expect(screen.getByTestId("ntf-title").textContent).toBe("エラー");
    expect(screen.getByTestId("ntf-delete-button")).toBeTruthy();
    expect(screen.getByTestId("ntf-body")).toBeTruthy();
    await userEvent.click(screen.getByTestId("ntf-delete-button")); //削除ボタンを押す
    expect(screen.queryByText("エラー")).toBeNull(); //消えていることを確認
    expect(screen.queryByTestId("ntf-delete-button")).toBeNull();
    expect(screen.queryByTestId("ntf-body")).toBeNull();
  });
  it("6 :Should render list of data from REST API when pressed update button", async () => {
    // 更新ボタンを押したときに取得した内容を描画されることを確認
    server.use(
      rest.get("http://127.0.0.1:3000/api/get", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
  });
});
