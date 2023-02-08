import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Puff, TailSpin } from "react-loader-spinner";
import NProgress from "nprogress";
import React, { useState, useEffect, useRef, forwardRef } from "react";
import { isMobile, isDesktop } from "react-device-detect";
import Select from "react-select";
import Image from "next/image";
import CalendarContainer from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCircleQuestion,
  faHandsHelping,
  faInfo,
  faMinus,
  faMinusSquare,
  faPlus,
  faPlusSquare,
  faQuestion,
  faQuestionCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
// import TP, { TimePickerProps } from "react-time-picker/dist/entry.nostyle";
import TextareaAutosize from "react-textarea-autosize";
import { faCalendarTimes } from "@fortawesome/free-regular-svg-icons";
// import { months } from "moment";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  solid,
  regular,
  light,
  thin,
  duotone,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { TimePicker } from "antd";
// import type { TimePickerProps } from "antd";

import moment, { Moment } from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Reservations = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const inputNameElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [userNameTaken, setUserNameTaken] = useState(false);
  const [showDateInfobox, setShowDateInfobox] = useState(false);
  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    hotel: null,
    tour: null,
    phone: "",
    numAdults: 0,
    numKids: 0,
    reservedBy: "",
    roomNumber: "",
    details: "",
  });
  const [reservationDate, setReservationDate] = useState(null);
  const [reservationTime, setReservationTime] = useState(null);
  const [mobileWidth, setMobileWidth] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    dob: {
      month: null,
      day: "",
      year: "",
    },
    password: "",
    confirmPassword: "",
  });
  const [nameValidation, setNameValidation] = useState([
    {
      isTouched: false,
    },
    {
      isTouched: false,
    },
  ]);
  const [emailValidation, setEmailValidation] = useState({
    valid: false,
    isTouched: false,
    userExists: false,
  });
  const [passwordValidation, setPasswordValidation] = useState([
    {
      passwordMinimum: false,
      message: "Minimum 8 characters",
      isTouched: false,
    },
    {
      passwordsMatch: false,
      message: "Passwords do not match",
      isTouched: false,
    },
  ]);

  useEffect(() => {
    if (session) {
      router.push("/");
    }

    const mediaQuery2 = window.matchMedia("(max-width: 490px)");
    setMobileWidth(mediaQuery2.matches);

    const matchMediaQuery2 = () => {
      setMobileWidth(mediaQuery2.matches);
    };
    mediaQuery2.addEventListener("change", matchMediaQuery2);

    if (!isMobile && inputNameElement.current) {
      inputNameElement.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexp.test(email)) {
      setEmailValidation((state) => ({
        ...state,
        valid: true,
      }));
    } else {
      setEmailValidation((state) => ({
        ...state,
        valid: false,
      }));
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Filter out an empty fields submission.
    if (
      !newUser.name ||
      /^\s*$/.test(newUser.name) ||
      !newUser.email ||
      /^\s*$/.test(newUser.email) ||
      !newUser.username ||
      newUser.username.length < 7 ||
      newUser.username.length > 15 ||
      !newUser.dob.day ||
      !newUser.dob.year ||
      newUser.dob.month === null ||
      0 === parseInt(newUser.dob.day) ||
      31 < parseInt(newUser.dob.day) ||
      parseInt(newUser.dob.year) < 1900 ||
      !validateUserAge13(
        newUser.dob.year,
        newUser.dob.month,
        newUser.dob.day
      ) ||
      new Date().getFullYear() < parseInt(newUser.dob.year) ||
      newUser.password.length < 8 ||
      newUser.confirmPassword.length < 8 ||
      newUser.password !== newUser.confirmPassword
    ) {
      return;
    }

    setLoading(true);
    setDisableButton(true);

    // create new pending User locally
    const pUser = {
      name: newUser.name,
      username: newUser.username,
      email: newUser.email.toLowerCase(),
      dobDay: newUser.dob.day,
      dobMonth: newUser.dob.month.value.toString(),
      dobYear: newUser.dob.year,
      password: newUser.password,
      // add collaborator priviledge
    };

    // api request
    NProgress.start();
    const registration = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pUser: pUser }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("registration submitted in register.tsx");
        return data;
      });

    const pwValidation = [...passwordValidation];
    pwValidation[0].isTouched = false;
    pwValidation[1].isTouched = false;
    setPasswordValidation(pwValidation);

    // checks if registration was success or failure
    if (registration) {
      if (registration.status === "success") {
        // On-Screen Visual respresentation of the registration (not backend)
        (document.activeElement as HTMLElement).blur();
        const namValidation = [...nameValidation];
        namValidation[0].isTouched = false;
        namValidation[1].isTouched = false;
        setNameValidation(namValidation);
        setNewUser((state) => ({
          ...state,
          name: "",
          email: "",
          username: "",
          dob: {
            ...state,
            day: "",
            month: null,
            year: "",
          },
          password: "",
          confirmPassword: "",
        }));
        setEmailSent(true);
        setLoading(false);
        setTimeout(async () => {
          router.push("/login");
        }, 7000);
      } else {
        // Failed registration

        // Only IF Email is taken
        if (registration.error && registration.error === "Email is taken") {
          setEmailValidation((state) => ({
            ...state,
            userExists: true,
          }));
        }
        if (registration.error && registration.error === "Username is taken") {
          setUserNameTaken(true);
        }
        setLoading(false);
        setDisableButton(false);
        // wipe passwords upon failed registration
        setNewUser((state) => ({
          ...state,
          password: "",
          confirmPassword: "",
        }));
      }
    }

    NProgress.done();

    // router.push(`/communities/${com}`);
  };

  const months = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  const hotels = [
    { name: "Blue Lagoon - Hilton" },
    { name: "Blue Lagoon - Homeweood" },
    { name: "Blue Lagoon - Pullman" },
    { name: "Dolphin - Courtyard" },
    { name: "Dolphin - Hilton" },
    { name: "Dolphin - Homeweood" },
    { name: "Doral - Best Western" },
    { name: "Doral - Holiday Inn" },
    { name: "Doral - Intercontinental" },
    { name: "Doral - Vacation Village" },
    { name: "Doral - Trump Hotel" },
    { name: "Lejune - Embassy Hotel" },
    { name: "Lejune - Element Hotel" },
    { name: "Lejune - Holiday Inn" },
    { name: "Lejune - Redroof Hotel" },
    { name: "Lejune - Staybridge Hotel" },
    { name: "Miami Spring - EB Hotel" },
    { name: "Miami Spring - Best Western" },
    { name: "Miami Spring - Comfort Old" },
    { name: "Miami Spring - Comfort New" },
    { name: "Miami Spring - EB Hotel" },
    { name: "72nd Avenue - DoubleTree" },
  ];

  const tours = [
    { name: "Big Bus Tour" },
    { name: "Key West" },
    { name: "Everglades" },
    { name: "Boat Tour" },
    { name: "Zoo Miami" },
    { name: "Big Bus + Boat" },
    { name: "Private Tour" },
    { name: "Custom Transport" },
  ];

  const mappedHotels = () => {
    const options = hotels.map((month, i) => ({
      id: i,
      label: month.name,
      value: i + 1,
    }));
    return options;
  };

  const mappedTours = () => {
    const options = tours.map((month, i) => ({
      id: i,
      label: month.name,
      value: i + 1,
    }));
    return options;
  };

  const validateUserAge13 = (year, month, day) => {
    // find the date 13 years ago
    const dateOfBirth = new Date(`${year}-${month.value}-${day}`);
    const date13YrsAgo = new Date();
    date13YrsAgo.setFullYear(date13YrsAgo.getFullYear() - 13);
    // check if the date of birth is before or on that date
    return dateOfBirth <= date13YrsAgo;
  };

  type Props = {
    value: string;
    onClick: () => void;
    onChange: () => void;
  };

  type RefType = number;

  const datePickingElement = useRef();

  const CustomDateInput = forwardRef<RefType, Props>(
    ({ onChange, value, onClick }, ref) => (
      <div
        onClick={onClick}
        className={`container max-w-[12rem] pl-4 pr-3 py-[0.41rem] ring-2 ring-orange-300 bg-white border-black rounded-sm+ flex items-center cursor-pointer select-none ${
          formSubmitted && reservationDate === null ? "ring-red-600" : ""
        }`}
      >
        <input
          className="outline-none border-black container max-w-[10rem] placeholder:text-base+ pt-[0.18rem] text-gray-700 text-[0.975rem] caret-transparent cursor-pointer select-none"
          placeholder="Select Date"
          onChange={onChange}
          value={value}
        />
        <div className="mx-auto inline-block relative h-5 w-5">
          <Image
            priority
            layout="fill"
            className="contrast-200 opacity-[60%]"
            src="/images/calendar_icon.svg"
            alt="Home"
            title="Home"
          />
        </div>
      </div>
    )
  );

  return (
    <Layout>
      <div className="mx-auto px-5 flex flex-col flex-1 w-full bg-no-repeat bg-cover bg-[url('/images/palms.jpg')]">
        <div className="mx-auto my-auto container flex flex-col flex-1">
          <form
            onSubmit={handleNewUser}
            className={`mx-auto mt-7 pt-8 pb-6 relative container self-center w-full rounded-md border-gray-400 text-base+ ${
              emailSent && formSubmitted
                ? "max-w-[30rem] mt-32 bg-white border-[0.09rem]"
                : "max-w-[40rem]"
            }`}
          >
            {loading && (
              <div className="absolute flex justify-center items-center h-full w-full -translate-y-28 rounded-md opacity-[100] z-10">
                <TailSpin color="rgb(92, 145, 199)" height={85} width={85} />
              </div>
            )}
            {!emailSent && (
              <div
                className={`mx-11 sm:mx-14 ${loading ? "opacity-[70%]" : ""}`}
              >
                <div className="font-bold font-[sans-serif] text-white text-center">
                  <div className="w-fit px-4 backdrop-blur-sm text-[36px] tracking-tight rounded-md pt-1 mx-auto">
                    FANTASTIC TOURS
                  </div>
                  <div className="w-fit px-4 -mt-1 pt-1 backdrop-blur-sm text-[20px] tracking-tight rounded-b-md mx-auto">
                    RESERVATIONS
                  </div>
                </div>
                <div className="mt-10">
                  {/*  New User Name */}
                  <input
                    ref={inputNameElement}
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s'.-]*$/.test(e.target.value)) {
                        const newValidation = [...nameValidation];
                        newValidation[0].isTouched = true;
                        setNameValidation(newValidation);
                        setNewUser((state) => ({
                          ...state,
                          name: e.target.value,
                        }));
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className={`mx-auto px-3 py-2 w-full placeholder-gray-400 text-gray-600 relative ring-2 ring-orange-300 bg-white rounded-sm
                      border-0 shadow-md outline-none focus:outline-none ${
                        formSubmitted &&
                        (!newUser.name || /^\s*$/.test(newUser.name))
                          ? "ring-red-600"
                          : ""
                      }`}
                  />
                  {formSubmitted &&
                    (!newUser.name || /^\s*$/.test(newUser.name)) && (
                      <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                        Name Required
                      </div>
                    )}
                </div>
                <div className="mt-7 flex flex-col">
                  <input
                    type="text"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => {
                      if (/\s/g.test(e.target.value)) {
                        e.preventDefault();
                      } else {
                        validateEmail(e.target.value);
                        setEmailValidation((state) => ({
                          ...state,
                          userExists: false,
                          isTouched: true,
                        }));
                        setNewUser((state) => ({
                          ...state,
                          email: e.target.value,
                        }));
                      }
                    }}
                    className={`mx-auto px-3 py-2 w-full placeholder-gray-400 text-gray-600 relative ring-2 ring-orange-300
                    bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none
                    ${
                      formSubmitted &&
                      (emailValidation.userExists || !emailValidation.valid)
                        ? "ring-red-600"
                        : ""
                    }`}
                  />
                  {formSubmitted && !emailValidation.valid && (
                    <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                      Invalid email
                    </div>
                  )}
                </div>
                <div className="mt-7 flex flex-col">
                  <Select
                    placeholder="Hotel"
                    className={`mx-auto px-3 w-23/24 flex flex-row relative bg-white 
                    rounded-sm border-0 ring-2 ring-orange-300 shadow-md outline-none ${
                      formSubmitted && newUser.dob.month === null
                        ? "ring-red-600"
                        : ""
                    }`}
                    // tabSelectsValue={false}
                    options={mappedHotels()}
                    value={reservation.hotel}
                    instanceId="select-reservation-hotel"
                    // isClearable={true}
                    onChange={(option) => {
                      setReservation((state) => ({
                        ...state,
                        hotel: option,
                      }));
                    }}
                    styles={{
                      control: (base) => ({
                        // outermost container
                        ...base,
                        fontSize: "1.06rem",
                        background: "white",
                        borderRadius: "3px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "none",
                        // padding: "0",
                        // margin: "auto",
                        // border: "1px solid red",
                        width: "100%",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        background: "transparent",
                        color: "rgb(75, 85, 99)",
                        width: "100%",
                      }),
                      input: (base) => ({
                        ...base,
                        // color: "none",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "rgb(156 163 175)",
                      }),
                      menu: (base) => ({
                        ...base,
                        // padding: "0rem 1rem 0 1rem",
                        // backgroundColor: "red",
                        width: "94.5%",
                      }),
                      menuList: (base) => ({
                        ...base,
                        // padding: "0 1rem 0 0",
                        width: "full",
                        border: "1px solid gray",
                        "::-webkit-scrollbar": {
                          width: "0px",
                          height: "0px",
                        },
                        "::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "::-webkit-scrollbar-thumb": {
                          background: "#888",
                        },
                        "::-webkit-scrollbar-thumb:hover": {
                          background: "#555",
                        },
                      }),
                      option: (
                        base,
                        { data, isDisabled, isFocused, isSelected }
                      ) => ({
                        ...base,
                        color: "black",
                        fontSize: "1rem",
                        padding: "0rem 1rem 0 1rem",
                        width: "full",
                        cursor: "pointer",
                        // backgroundColor: isSelected ? "rgb(220, 220, 220)" : "default",
                        // ":hover": {
                        //   backgroundColor: "rgb(220, 220, 220)",
                        // },
                        // backgroundColor: isFocused
                        //   ? "rgb(220, 220, 220)"
                        //   : "white",
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        background: "transparent",
                        padding: "0 0 0 0",
                        margin: "0",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 0,
                        alignSelf: "center",
                        color: "gray",
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        padding: "0",
                        marginRight: "0.4rem",
                        backgroundColor: "transparent",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                    }}
                  />

                  {formSubmitted && reservation.hotel === null && (
                    <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                      Hotel Required
                    </div>
                  )}
                </div>
                <div className="mt-7">
                  <Select
                    placeholder="Tour"
                    className={`mx-auto px-3 w-23/24 flex flex-row relative bg-white 
                    rounded-sm border-0 ring-2 ring-orange-300 shadow-md outline-none ${
                      formSubmitted && newUser.dob.month === null
                        ? "ring-red-600"
                        : ""
                    }`}
                    // tabSelectsValue={false}
                    options={mappedTours()}
                    value={reservation.tour}
                    instanceId="select-reservation-tour"
                    // isClearable={true}
                    onChange={(option) => {
                      setReservation((state) => ({
                        ...state,
                        tour: option,
                      }));
                    }}
                    styles={{
                      control: (base) => ({
                        // outermost container
                        ...base,
                        fontSize: "1.06rem",
                        background: "white",
                        borderRadius: "3px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "none",
                        // padding: "0",
                        // margin: "auto",
                        // border: "1px solid red",
                        width: "100%",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        background: "transparent",
                        color: "rgb(75, 85, 99)",
                        width: "100%",
                      }),
                      input: (base) => ({
                        ...base,
                        // color: "none",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "rgb(156 163 175)",
                      }),
                      menu: (base) => ({
                        ...base,
                        // padding: "0rem 1rem 0 1rem",
                        // backgroundColor: "red",
                        width: "94.5%",
                      }),
                      menuList: (base) => ({
                        ...base,
                        // padding: "0 1rem 0 0",
                        width: "full",
                        border: "1px solid gray",
                        "::-webkit-scrollbar": {
                          width: "0px",
                          height: "0px",
                        },
                        "::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "::-webkit-scrollbar-thumb": {
                          background: "#888",
                        },
                        "::-webkit-scrollbar-thumb:hover": {
                          background: "#555",
                        },
                      }),
                      option: (
                        base,
                        { data, isDisabled, isFocused, isSelected }
                      ) => ({
                        ...base,
                        color: "black",
                        fontSize: "1rem",
                        padding: "0rem 1rem 0 1rem",
                        width: "full",
                        cursor: "pointer",
                        // backgroundColor: isSelected ? "rgb(220, 220, 220)" : "default",
                        // ":hover": {
                        //   backgroundColor: "rgb(220, 220, 220)",
                        // },
                        // backgroundColor: isFocused
                        //   ? "rgb(220, 220, 220)"
                        //   : "white",
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        background: "transparent",
                        padding: "0 0 0 0",
                        margin: "0",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 0,
                        alignSelf: "center",
                        color: "gray",
                      }),
                      indicatorSeparator: (base) => ({
                        ...base,
                        padding: "0",
                        marginRight: "0.4rem",
                        backgroundColor: "transparent",
                        margin: "0",
                        // border: "1px solid red",
                      }),
                    }}
                  />

                  {(userNameTaken && (
                    <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                      Username is taken
                    </div>
                  )) ||
                    (formSubmitted && reservation.tour === null && (
                      <div className="-mb-6 px-3 pt-1 text-red-600 text-sm">
                        Invalid username
                      </div>
                    ))}
                </div>

                <div className="mt-7">
                  <div className="mx-auto w-21/24 flex justify-center items-center">
                    <PhoneInput
                      country={"us"}
                      value={reservation.phone}
                      onChange={(
                        phone,
                        data: { dialCode },
                        event,
                        formattedValue
                      ) => {
                        setReservation((state) => ({
                          ...state,
                          phone: formattedValue,
                        }));

                        // handlePhoneInput(phone);
                      }}
                      placeholder="Phone Number"
                      inputStyle={{
                        // backgroundColor: "black",
                        width: "100%",
                        border: "none",
                        display: "flex",
                        fontSize: "1.03rem",
                        color: "rgb(75, 85, 99)",
                      }}
                      // containerStyle={{
                      //   display: "block",
                      //   alignItems: "center",
                      // }}
                      // autoFormat={false}
                      // searchClass="bg-black"
                      // enableSearch={true}
                      // disableSearchIcon={true}
                      // disableCountryCode={true}
                      countryCodeEditable={false}
                      buttonClass="h-full self-center"
                      inputClass="text-bg container w-full flex items-center inline-block placeholder:text-base pt-[0.18rem]"
                      containerClass={`mx-auto pr-2 py-0.5 container w-full flex placeholder-gray-400 text-black relative ring-2 ring-orange-300
                      bg-white rounded-sm border-0 shadow-md outline-none focus:outline-none
                    ${
                      formSubmitted &&
                      (emailValidation.userExists || !emailValidation.valid)
                        ? "ring-red-600"
                        : ""
                    }`}
                    />
                  </div>
                </div>

                <div className="mt-7">
                  <div className="mx-auto w-21/24 flex justify-evenly">
                    <DatePicker
                      //   selectsRange={true}
                      //   id="reservation-datepicker"
                      //   className="pl-4 py-1.5 rounded-sm+ inline-block"
                      //   calendarContainer={MyContainer}
                      //   isSecure={true}
                      // ref={datePickingElement}
                      // calendarClassName=""
                      // placeholderText="Select Date"
                      selected={reservationDate}
                      onChange={(date: Date) => setReservationDate(date)}
                      customInput={
                        <CustomDateInput
                          ref={datePickingElement}
                          value={reservationDate}
                          onClick={() => onclick}
                          onChange={() => onchange}
                        />
                      }
                      // Long Months
                      dateFormat={
                        mobileWidth &&
                        (reservationDate?.getMonth() === 0 ||
                          reservationDate?.getMonth() === 1 ||
                          reservationDate?.getMonth() === 8 ||
                          reservationDate?.getMonth() === 10 ||
                          reservationDate?.getMonth() === 11)
                          ? "MMM d, yyyy"
                          : "MMMM d, yyyy"
                      }
                      withPortal
                    />
                    {/* </span> */}
                    {/* <TP
                      onChange={(date: Date) => setReservationTime(date)}
                      className="px-2 border-none outline-none bg-white rounded-sm+ ring-2 ring-orange-300"
                      clockClassName="class1 class2"
                      portalContainer
                    /> */}
                    <TimePicker
                      //   onFocus={(e) => e.preventDefault()}
                      {...TimePicker}
                      allowClear={false}
                      inputReadOnly
                      minuteStep={5}
                      format="h:mm A"
                      placeholder="Select Time"
                      use12Hours={true}
                      showSecond={false}
                      hideDisabledOptions={false}
                      className={`max-w-[9.6rem] container ring-2 focus:ring-2 before:border-none hover:border-none bg-white rounded-sm+ focus:ring-orange-300 outline-none ring-orange-300 cursor-pointer`}
                      value={reservationTime}
                      onChange={(value, dateString: string) => {
                        // console.log("Time", dateString);
                        setReservationTime(moment(dateString, "h:mm A"));
                      }}
                      onSelect={(value) => {
                        // console.log("Time", dateString);
                        setReservationTime(value);
                      }}
                      // popupClassName="ring-2 ring-orange-300"
                      // defaultValue="10:00 AM"
                    />
                    {/* <TimePicker format="HH:mm" /> */}
                    {/* <input
                      type="date"
                      className="px-3 py-1.5 rounded-sm+"
                      placeholder="Select Date"
                    /> */}
                    {/* <input
                      type="time"
                      className="pl-5 pr-4 py-1.5 rounded-sm+"
                      placeholder="Time"
                    /> */}
                  </div>
                </div>

                <div className="mt-7 ">
                  <div className="mx-auto w-21/24 flex justify-evenly">
                    <div className="bg-white pl-4 pr-2 rounded-sm+ flex justify-between items-center ring-2 ring-orange-300 overflow-hidden w-min-0 container max-w-[12rem]">
                      <div
                        className={`py-2 rounded-sm+ text-[1.03rem] outline-none select-none w-min-0 overflow-hidden ${
                          reservation.numAdults > 0
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        Adults
                      </div>
                      <div className="flex justify-between items-center overflow-visible">
                        <FontAwesomeIcon
                          icon={faMinusSquare}
                          onClick={() => {
                            if (reservation.numAdults > 0) {
                              setReservation((state) => ({
                                ...state,
                                numAdults: reservation.numAdults - 1,
                              }));
                            }
                          }}
                          className={`px-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem] mr-0.5`}
                        />
                        <div className="font-semibold text-gray-500 w-5 text-center border-black select-none">
                          {reservation.numAdults}
                        </div>
                        <FontAwesomeIcon
                          icon={faPlusSquare}
                          onClick={() =>
                            setReservation((state) => ({
                              ...state,
                              numAdults: reservation.numAdults + 1,
                            }))
                          }
                          className={`px-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                        />
                      </div>
                    </div>
                    <div className="bg-white pl-4 pr-2 rounded-sm+ flex justify-between items-center ring-2 ring-orange-300 overflow-hidden w-min-0 container max-w-[9.6rem]">
                      <div
                        className={`py-2 rounded-sm+ text-[1.03rem] outline-none select-none w-min-0 overflow-hidden ${
                          reservation.numKids > 0
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        Kids
                      </div>
                      <div className="flex justify-between items-center overflow-visible">
                        <FontAwesomeIcon
                          icon={faMinusSquare}
                          onClick={() => {
                            if (reservation.numKids > 0) {
                              setReservation((state) => ({
                                ...state,
                                numKids: reservation.numKids - 1,
                              }));
                            }
                          }}
                          className={`px-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem] mr-0.5`}
                        />
                        <div className="font-semibold text-gray-500 w-5 text-center border-black select-none">
                          {reservation.numKids}
                        </div>
                        <FontAwesomeIcon
                          icon={faPlusSquare}
                          onClick={() =>
                            setReservation((state) => ({
                              ...state,
                              numKids: reservation.numKids + 1,
                            }))
                          }
                          className={`px-1 py-0.5 rounded-sm+ cursor-pointer text-neutral-400 contrast-[2.4] hover:contrast-[2] text-[1.4rem]`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 container">
                  <div className="mx-auto w-21/24 flex justify-evenly container">
                    <input
                      type="text"
                      placeholder="Reserved By (option)"
                      className="max-w-[12rem] pl-3.5 pr-2 py-[0.46rem] text-base placeholder:text-[1.05rem] text-gray-600 rounded-sm+ ring-2 ring-orange-300 outline-none container"
                    />
                    <input
                      type="text"
                      placeholder="Room #"
                      className="max-w-[9.6rem] pl-3.5 pr-2 py-[0.46rem] text-base placeholder:text-[1.05rem] text-gray-600 rounded-sm+ ring-2 ring-orange-300 outline-none container"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mx-auto w-11/12 rounded-sm border-blue-300 container border-0 shadow-lg ring-2 ring-orange-300">
                    <TextareaAutosize
                      onFocus={(e) => {
                        var val = e.target.value;
                        e.target.value = "";
                        e.target.value = val;
                      }}
                      minRows={3}
                      className="text-gray-600 block container px-3.5 py-2.5 outline-none no-scroll"
                      placeholder="Details"
                      value={reservation.details}
                      onChange={(e) =>
                        setReservation((state) => ({
                          ...state,
                          details: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mt-8 w-full border-black">
                  <button
                    disabled={disableButton}
                    className="px-3 py-2 border w-full hover:saturate-[3] saturate-[2] text-gray-700 bg-orange-300 text-xl
                    font-semibold border-gray-500 rounded-sm+ outline-none"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
            {formSubmitted && emailSent && (
              <div
              // className="m-auto -translate-y-20 pt-14 pb-7 container self-center w-full bg-white max-w-[30rem] rounded-lg border-[0.09rem] border-indigo-300 saturate-[1.5]"
              >
                <div className="mx-auto bg-indigo-100 rounded-[2rem] mt-6 mb-9 h-44 w-64 relative">
                  <Image
                    layout="fill"
                    className="cursor-pointer"
                    src="/images/email-icon-shrunk.png"
                    alt="Home"
                    title="Home"
                  />
                </div>
                <h3 className="text-2.5xl mt-5 mb-0 font-semibold text-gray-700 text-center">
                  Email Sent!
                </h3>
                <div className="container mt-3 mx-auto">
                  <div className="text-center text-sm+ leading-5 px-12">
                    Check your email. Your account's activation link will be
                    active for 24 hours
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Reservations;
