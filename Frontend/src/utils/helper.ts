import { useNavigate } from "react-router";
import { setStore, useStore } from "./store/store";
// import CryptoAES from "crypto-js/aes";
// import CryptoENC from "crypto-js/enc-utf8";

// const encrypt = (originalData: any) => {
//   return CryptoAES.encrypt(JSON.stringify(originalData), useStore.getState().secretKey).toString();
// };
// const decrypt = (originalData: string) => {
//   if (typeof originalData == "string") {
//     const decrypted = JSON.parse(CryptoAES.decrypt(originalData, useStore.getState().secretKey).toString(CryptoENC));
//     return decrypted;
//   } else {
//     return null;
//   }
// };
const generateTimestamp = (year: number, month: number = 1, date: number = 1): number => {
  const timestamp = new Date(year, month - 1, date).getTime();
  return timestamp;
};
const convertToHumanDate = (timeStamp: string | number): string => {
  if (typeof timeStamp == "string") {
    return (
      new Date(parseInt(timeStamp)).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) || "-"
    );
  } else {
    return (
      new Date(timeStamp).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) || "-"
    );
  }
};
const epocToInput = (timeStamp: string | number): string => {
  return `${new Date(timeStamp).getFullYear()}-${String(new Date(timeStamp).getMonth()).padStart(2, "0")}-${String(
    new Date(timeStamp).getDate()
  ).padStart(2, "0")}`;
};

const convertToBillNumber = (num: number | string): string => {
  if (typeof num == "string") {
    return `Rp. ${parseInt(num, 10).toLocaleString()},-` || "-";
  } else {
    return `Rp. ${num.toLocaleString()},-` || "-";
  }
};

const getFlavor = (): string => {
  return import.meta.env.VITE_MODE;
};

const getDaysName = (epoc: number): string => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var dayName = days[new Date(epoc).getDay()];
  return dayName;
};
const getHours = (epoc: number): string => {
  return `${("0" + new Date(epoc).getHours()).slice(-2)}:${("0" + new Date(epoc).getMinutes()).slice(-2)}`;
};

const authorityCheck = (errorStatus: number): void => {
  if (errorStatus === 401) {
    // logout();
  } else if (errorStatus === 403) {
    const navigate = useNavigate();
    navigate("/unauthorized");
  }
};

const logout = () => {
  setStore("token", "");
  localStorage.clear();
  location.href = "/auth/login";
};

const useToken = () => {
  return {
    headers: {
      Authorization: useStore.getState().token,
    },
  };
};

export const helper = {
  // encrypt,
  // decrypt,
  generateTimestamp,
  convertToHumanDate,
  epocToInput,
  convertToBillNumber,
  getFlavor,
  getDaysName,
  getHours,
  authorityCheck,
  useToken,
  logout,
};
