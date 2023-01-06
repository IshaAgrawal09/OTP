import { Card, Datepicker, FlexChild, FlexLayout } from "@cedcommerce/ounce-ui";
import React, { useState } from "react";
import moment from "moment";

const DatePicker = () => {
  const [dateData, setDateData] = useState({});

  const disabledDate = (event) => {
    const date = new Date();
    console.log(date.getDate());
    if (date.getDate() > 1) {
      return event && event < moment().add(-1, "day");
    }

    // console.log(moment().add(-1, "day"));
    // if (dateData.endDate !== undefined) {
    //   const endDate = dateData.endDate.split("/");

    //   return (
    //     (event && event < moment().add(-1, "day")) ||
    //     event > moment([endDate[2], endDate[0] - 1, endDate[1]]).add(-1, "day")
    //   );
    // }
    // return event && event < moment().add(-1, "day");
  };
  return (
    <Card cardType="Bordered" desktopWidth="33" mobileWidth="100">
      <FlexLayout halign="fill" valign="center">
        <FlexChild>
          <Datepicker
            format="MM/DD/YYYY"
            min="2023/01/06"
            placeholder="MM/DD/YYYY"
            picker="date"
            disabledDate={disabledDate}
            onChange={(allData, date) => {
              if (allData)
                setDateData({
                  ...dateData,
                  startDate: date,
                });
            }}
            value={dateData.startDate ? moment(dateData.startDate) : undefined}
          />
        </FlexChild>
        <FlexChild>
          <Datepicker
            disabled={dateData.startDate === undefined}
            // disabledDate={disabledEndDate}
            format="MM/DD/YYYY"
            placeholder="MM/DD/YYYY"
            onChange={(allData, date) => {
              if (allData)
                setDateData({
                  ...dateData,
                  endDate: date,
                });
            }}
            value={dateData.endDate ? moment(dateData.endDate) : undefined}
          />
        </FlexChild>
      </FlexLayout>
    </Card>
  );
};

export default DatePicker;
