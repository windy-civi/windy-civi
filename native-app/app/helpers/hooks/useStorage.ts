import AsyncStorage from "@react-native-async-storage/async-storage";

interface StoreDataProps {
  key: string;
  value: string;
}

interface GetDataProps {
  key: string;
}

export const useStorage = () => {
  const storeData = async ({ key, value }: StoreDataProps) => {
    try {
      const jsonValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      throw new Error("Error storing data", { cause: e });
    }
  };

  const getData = async ({ key }: GetDataProps) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      throw new Error("Error reading data", { cause: e });
    }
  };

  return { storeData, getData };
};
