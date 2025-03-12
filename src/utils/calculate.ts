import lifePathData from "../../public/json/life_path.json";

export function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22) {
    num = num
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

export interface NumberCharacteristic {
  number: number;
  characteristic: string;
}

export function calculateLifePathNumber(
  birthdate: string
): NumberCharacteristic {
  const [day, month, year] = birthdate
    .split("-")
    .map((num) => parseInt(num, 10));

  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);

  const lifePathNumber = reduceToSingleDigit(
    reducedDay + reducedMonth + reducedYear
  );

  // Tìm thông tin tương ứng trong JSON
  const lifePathInfo = lifePathData.find(
    (entry) => entry.life_path_number === lifePathNumber
  );

  return {
    number: lifePathNumber,
    characteristic: lifePathInfo ? lifePathInfo.overview : "Không có dữ liệu",
  };
}

export function calculateAll(
  name: string,
  birthdate: string
): NumberCharacteristic {
  return calculateLifePathNumber(birthdate);
}
