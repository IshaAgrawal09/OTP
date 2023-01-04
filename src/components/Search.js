import "@cedcommerce/ounce-ui/dist/index.css";
import {
  AutoComplete,
  Badge,
  Card,
  FlexChild,
  FlexLayout,
} from "@cedcommerce/ounce-ui";
import axios from "axios";
import React, { useRef, useState } from "react";

const Search = () => {
  const [searchVal, setSearchVal] = useState("");
  const [selectedAudience, setSelectedAudience] = useState([]);

  const inputRef = useRef();

  //   ONCHANGE FUNC
  const SearchFunc = (event) => {
    clearTimeout(inputRef.current);
    inputRef.current = setTimeout(() => {
      // ABORT
      if (window.controller) {
        window.controller.abort();
      }
      window.controller = new AbortController();
      var signal = window.controller.signal;

      //   FETCH REQUEST
      //   fetch("https://jsonplaceholder.typicode.com/posts", { signal: signal })
      //     .then((res) => res.json())
      //     .then((actualData) => console.log(actualData));

      // AXIOS REQUEST
      axios
        .get(`https://jsonplaceholder.typicode.com/todos`, {
          signal: signal,
        })
        .then((res) => console.log(res));
    }, 500);

    setSearchVal(event);
  };
  console.log(searchVal);

  const audienceFunc = (event) => {
    console.log(event, "clicked");
    setSelectedAudience([...selectedAudience, event]);
    setSearchVal("");
  };
  return (
    <div>
      <Card title="Autocomplete">
        {selectedAudience?.map((item, index) => {
          return (
            <Badge type="Neutral-200" key={index}>
              {item}
            </Badge>
          );
        })}

        <FlexLayout>
          <FlexChild desktopWidth="100" mobileWidth="100" tabWidth="100">
            <AutoComplete
              clearButton
              clearFunction={function noRefCheck() {}}
              extraClass=""
              name="Define the group of people who will see your Ads based on their demographics, interests, behavior, and more."
              onChange={SearchFunc}
              onClick={audienceFunc}
              options={[
                { label: "Hello", value: "Hello" },
                { label: "Hi", value: "Hi" },
              ]}
              placeHolder="Search Your Items"
              popoverPosition="right"
              setHiglighted
              showHelp="Kindly Search your required Item"
              showPopover
              thickness="thick"
              value={searchVal}
            />
          </FlexChild>
        </FlexLayout>
      </Card>
    </div>
  );
};

export default Search;
