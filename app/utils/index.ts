import * as Yup from "yup";

export const getRecentYears = (): Options => {
  const currentYear = new Date().getFullYear();
  const recentYears = [];

  for (let i = 0; i < 4; i++) {
    const year = currentYear - i;
    recentYears.push({
      label: year.toString(),
      value: year,
      description: `A year in the 21st century, ${
        i === 0 ? "current year" : ""
      }`,
    });
  }

  return recentYears;
};

export const generateYupValidationSchema = (
  count: number,
  values: SelectedOptions
): [YupValidationSchema, InitialState] => {
  const validationSchema: YupValidationSchema = {};
  const initialState: { [Key: string]: string } = {};

  for (let i = 0; i < count; i++) {
    validationSchema[`toYear${i}`] = Yup.string().required(
      "Please select a year"
    );
    validationSchema[`toMonth${i}`] = Yup.string().required(
      "Please select a month"
    );
    validationSchema[`fromYear${i}`] = Yup.string().required(
      "Please select a year"
    );
    validationSchema[`fromMonth${i}`] = Yup.string().required(
      "Please select a month"
    );
    validationSchema[`pay${i}`] = Yup.number().required(
      "Please select a valid pay"
    );

    initialState[`toYear${i}`] = values[`toYear${i}`] ?? "";
    initialState[`toMonth${i}`] = values[`toMonth${i}`] ?? "";
    initialState[`fromYear${i}`] = values[`fromYear${i}`] ?? "";
    initialState[`fromMonth${i}`] = values[`fromMonth${i}`] ?? "";
    initialState[`pay${i}`] = values[`pay${i}`] ?? undefined;

  }


  return [Yup.object().shape(validationSchema), initialState];
};

export const getMonths = (): Options => [
  { label: "January", value: 1, description: "The first month of the year" },
  { label: "February", value: 2, description: "The second month of the year" },
  { label: "March", value: 3, description: "The third month of the year" },
  { label: "April", value: 4, description: "The fourth month of the year" },
  { label: "May", value: 5, description: "The fifth month of the year" },
  { label: "June", value: 6, description: "The sixth month of the year" },
  { label: "July", value: 7, description: "The seventh month of the year" },
  { label: "August", value: 8, description: "The eighth month of the year" },
  { label: "September", value: 9, description: "The ninth month of the year" },
  { label: "October", value: 10, description: "The tenth month of the year" },
  {
    label: "November",
    value: 11,
    description: "The eleventh month of the year",
  },
  {
    label: "December",
    value: 12,
    description: "The twelfth month of the year",
  },
];

export const validateDateRanges = (
  data: SelectedOptions,
  index: number
): DisableFields => {
  const fromYear = parseInt(data[`fromYear${index}`]);
  const fromMonth = parseInt(data[`fromMonth${index}`]);
  const toYear = parseInt(data[`toYear${index}`]);
  const toMonth = parseInt(data[`toMonth${index}`]);
  const years = getRecentYears();
  const months = getMonths();

  let disablefromMonth: string[] = [];
  let disablefromYear: string[] = [];

  const disabletoYear = years
    .map((year) => fromYear > year.value && `${year.value}`)
    .filter((year) => typeof year === "string") as string[];
  const disabletoMonth = months
    .map(
      (month) =>
        toYear === fromYear && fromMonth >= month.value && `${month.value}`
    )
    .filter((month) => typeof month === "string") as string[];

  if (index > 0) {
    const prevToYear = parseInt(data[`toYear${index - 1}`]);
    const prevToMonth = parseInt(data[`toMonth${index - 1}`]);
    disablefromMonth = months
      .map((month) => {
        if (fromYear === prevToYear) {
          return prevToMonth >= month.value && `${month.value}`;
        } else if (prevToMonth === 12) {
          return undefined;
        } else {
          return prevToMonth <= month.value && `${month.value}`;
        }
      })
      .filter((month) => typeof month === "string") as string[];

    disablefromYear = years
      .map((year) => {
        console.log("Year", year, toYear);
        if (prevToMonth === 12) {
          return prevToYear + 1 > year.value && `${year.value}`;
        }

        return prevToYear > year.value && `${year.value}`;
      })
      .filter((year) => typeof year === "string") as string[];
  } else {
    disablefromMonth = months
      .map(
        (month) =>
          fromYear === toYear && toMonth <= month.value && `${month.value}`
      )
      .filter((month) => typeof month === "string") as string[];

    disablefromYear = years
      .map((year) => toYear < year.value && `${year.value}`)
      .filter((year) => typeof year === "string") as string[];
  }
  return {
    [`dfromMonth${index}`]: disablefromMonth,
    [`dfromYear${index}`]: disablefromYear,
    [`dtoMonth${index}`]: disabletoMonth,
    [`dtoYear${index}`]: disabletoYear,
  };
};
