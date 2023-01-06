/* eslint-disable array-callback-return */
import "@cedcommerce/ounce-ui/dist/index.css";
import {
  AutoComplete,
  Button,
  Card,
  FlexChild,
  FlexLayout,
  Tag,
  TextStyles,
} from "@cedcommerce/ounce-ui";

import React, { useRef, useState } from "react";
import PopoverComp from "./PopoverComp";

const Search = () => {
  const [searchVal, setSearchVal] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState({});

  const inputRef = useRef();

  //   ONCHANGE FUNC
  const SearchFunc = (event) => {
    setOptions([]);
    setLoading(true);
    clearTimeout(inputRef.current);
    inputRef.current = setTimeout(() => {
      // ABORT
      if (window.controller) {
        window.controller.abort();
      }
      window.controller = new AbortController();
      var signal = window.controller.signal;

      // FETCH REQUEST
      if (event) {
        fetch(
          `https://testing-app-backend.bwpapps.com/meta/campaign/getAudience?query=${event}&shop_id=796`,
          {
            signal: signal,
            headers: {
              appcode: "eyJvbnl4IjoiYndwIiwibWV0YSI6Im1ldGEifQ==",
              authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjM4ODg3ZDQ2NGEwOGE2MmJmMDhhZDNmIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjczMDEzNTU5LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzYjdmMGY3MTNhMTNkYzQ4MTBhZTI0ZCJ9.btZ0NCdtBPbl-t5Refjgyc1vobWLBv4lU_cvvYVFQM8RdF0t3ndJxN9TxIyXVQYDXoH8kREWlKAyKKncxBtz5M1k6o1z12Ksv8Cd10A9A2c4jHcc8wtcWUSB0vqD0veb0YZjDik7RinfdB0mW0J_Ib0MN3g04teInXFsApokcVLy7C6ZhoczZd_WhvRzK1zccGKIMVR5UIs3ScD9AARbsT-qb_3a_Kant4vVzX_Gm9S8EJVvPuXVf9lzBsaq3_y4YVUZpbipPU9ErDLU5GG0eAAeSX4p1m_kwbIai3EohuSz6Q1OugqNSRD_ie-m0rc69DWC3JPaF-S_eOa2FQuHpw",
              apptag: "bwp_meta",
            },
          }
        )
          .then((res) => res.json())
          .then((actualData) => {
            const { success, data } = actualData;

            if (success) {
              let tempArr = [];
              data.map((item) => {
                let path = [...item.path];
                path.splice(0, 1);
                let pathData = path.join(" > ");
                tempArr.push({
                  id: item.id,
                  label: item.name,
                  value: item.name,
                  lname: item.path[0],
                  path: item.path,
                  popoverContent: PopoverComp(item, pathData),
                });
              });
              setOptions([...tempArr]);
            }
          })
          .finally(() => setLoading(false));
      }
    }, 500);
    setSearchVal(event);
  };

  // ONCLICK FUNC
  const audienceFunc = (event) => {
    var audience = options.find((item) => item.value === event);
    audience.path.splice(-1);
    let path = audience.path.join(" > ");
    // DUPLICATE DATA
    let audienceExist = "";
    if (selectedAudience.hasOwnProperty(path)) {
      audienceExist = selectedAudience[path].find(
        (item) => audience.value === item
      );
    }
    if (!audienceExist) {
      let tempobj = { ...selectedAudience };
      if (tempobj.hasOwnProperty(path)) tempobj[path].push(audience.value);
      else tempobj[path] = [audience.value];

      setSelectedAudience({ ...tempobj });
    }
    setSearchVal("");
  };

  // REMOVE PARTICULAR SELECTED AUDIENCE
  const delChild = (key, childInd) => {
    let tempObj = { ...selectedAudience };
    tempObj[key].splice(childInd, 1);
    if (tempObj[key].length === 0) delete tempObj[key];
    setSelectedAudience({ ...tempObj });
  };

  // DELETE ENTIRE ROW OF SELECTED AUDIENCE
  const delEntireRow = (key) => {
    let tempObj = { ...selectedAudience };
    delete tempObj[key];
    setSelectedAudience({ ...tempObj });
  };

  return (
    <Card cardType="Bordered">
      {Object.keys(selectedAudience)?.map((item) => {
        return (
          <Card cardType="Subdued" desktopWidth="33" mobileWidth="100">
            <TextStyles content={item} />
            <Card>
              <FlexLayout halign="fill" valign="center">
                <Card desktopWidth="33" mobileWidth="100">
                  <FlexLayout spacing="loose">
                    {selectedAudience[item]?.map((element, ind) => {
                      return (
                        <Tag key={ind} destroy={() => delChild(item, ind)}>
                          {element}
                        </Tag>
                      );
                    })}
                  </FlexLayout>
                </Card>
                <Button
                  content="X"
                  type="Secondary"
                  onClick={() => delEntireRow(item)}
                />
              </FlexLayout>
            </Card>
          </Card>
        );
      })}

      <FlexLayout>
        <FlexChild desktopWidth="50" mobileWidth="100">
          <AutoComplete
            className="searchField"
            onChange={SearchFunc}
            onClick={audienceFunc}
            options={options}
            placeHolder="Search for demographics, interests, behaviors, etc."
            name="Search and select groups"
            popoverPosition="right"
            setHiglighted
            showPopover={true}
            thickness="thick"
            value={searchVal}
            loading={loading}
          />
        </FlexChild>
      </FlexLayout>
    </Card>
  );
};

export default Search;
