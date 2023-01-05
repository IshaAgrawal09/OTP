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
    setLoading(true);
    clearTimeout(inputRef.current);
    inputRef.current = setTimeout(() => {
      // ABORT
      if (window.controller) {
        window.controller.abort();
      }
      window.controller = new AbortController();
      var signal = window.controller.signal;

      //   FETCH REQUEST
      fetch(
        `https://testing-app-backend.bwpapps.com/meta/campaign/getAudience?query=${event}&shop_id=796`,
        {
          signal: signal,
          headers: {
            appcode: "eyJvbnl4IjoiYndwIiwibWV0YSI6Im1ldGEifQ==",
            authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjM4ODg3ZDQ2NGEwOGE2MmJmMDhhZDNmIiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjcyOTM4MjY1LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzYjZjYWQ5YmFlZjAxMWQ2ZTBkZjQ2MyJ9.FDiKHhIY1ZntbNdEEWjtk5r6QnRvQYbXnO9PjsO1Fu6YYz7VkkoiLGz_FmNelpGo46QCQV6xUBsE9ENnmYUhIe-tdZR3FDFsvC-sYELg_4NEfqBolo-aDMwfSlbmKMdJ6tgPVfq72np9AxgygDgpVCw7cklxOYZvpHgcidBy34WCGm3lnRVvTXp1Txp2pjBeZ4r7Rx253o5sgk9fyzL_paHlxZIG9y_czQzO_iflJCVo9u4iNtQloVTZg2_1CoQWdVnjo1N3Xj17zWZXzZeXp6JaGNiB355WsstRx0OtVCQdoKd7_lOgOlSdNXeKZgpmMm1nEOp19g_Cn5Y1uF9jVQ",
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
    }, 500);
    setSearchVal(event);
  };

  // ONCLICK FUNC
  const audienceFunc = (event) => {
    let audience = options.find((item) => item.value === event);
    audience.path.splice(-1);
    let path = audience.path.join(" > ");

    let tempobj = { ...selectedAudience };
    if (tempobj.hasOwnProperty(path)) {
      tempobj[path].push(audience.value);
    } else {
      tempobj[path] = [audience.value];
    }
    setSelectedAudience({ ...tempobj });
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
    <Card cardType="Bordered" desktopWidth="33" mobileWidth="100">
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
        <FlexChild desktopWidth="33" mobileWidth="100" tabWidth="100">
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
