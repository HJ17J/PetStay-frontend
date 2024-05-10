import { useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import "../styles/Mypage.scss";
import Picker from "@emoji-mart/react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { UserData, Reservation } from "../types/reservation";
import { SignupErrorPayload, SignupPayload, UserType } from "../types/authTypes";
import { PetSitterDetail, ProfileResponse } from "../types/PetSitter";
import { userInfo } from "os";
import { CommonUserInterface } from "../types/user";
import { setPetSitters } from "../store/PetSitterSlice";
interface UserprofileProps {
  toggleModal: (e: SyntheticEvent) => void;
}

export default function Userprofile({ toggleModal }: UserprofileProps) {
  // 펫시터 동물 항목 한글로 변경
  const setKoAnimalType = (type: string) => {
    if (type === "dog") {
      return "강아지";
    } else if (type === "cat") {
      return "고양이";
    } else {
      return "기타";
    }
  };
  const DEFAULT_PROFILE: ProfileResponse = {
    address: "",
    career: "",
    confirm: true,
    id: 0,
    img: "",
    license: "",
    name: "",
    oneLineIntro: "",
    pay: 0,
    selfIntroduction: "",
    type: "",
    userid: "",
    useridx: 0,
    userpw: "",
    usertype: UserType.SITTER,
  };

  const DEFAULT_USER: CommonUserInterface = {
    useridx: 0,
    userid: "",
    userpw: "",
    name: "",
    address: "",
    img: "",
    usertype: UserType.USER,
  };

  const [sitterProfile, setSitterProfile] = useState<ProfileResponse>(DEFAULT_PROFILE);
  const [userInfo, setUserInfo] = useState<CommonUserInterface>(DEFAULT_USER);

  const fetchUserData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_SERVER}/profile`);
      setUserInfo(response.data.userData);
      if (response.data.userData.usertype === UserType.SITTER) {
        setSitterProfile({ ...response.data.sitterData, ...response.data.userData });
      } else {
        setUserInfo(response.data.userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const [uploadProfileImage, setUploadProfileImage] = useState<File | null>(null);
  const [uploadUserImage, setUploadUserImage] = useState<File | null>(null);
  const [checkedTypes, setCheckedTypes] = useState<string[]>([]);

  useEffect(() => {
    const updatedType = checkedTypes.join(",");
    setSitterProfile((prevProfile) => ({ ...prevProfile, type: updatedType }));
  }, [checkedTypes]);

  // Handle checkbox change
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      // Add the checked type to the array if it's not already present
      if (!checkedTypes.includes(value)) {
        setCheckedTypes((prevTypes) => [...prevTypes, value]);
      }
    } else {
      // Remove the unchecked type from the array
      setCheckedTypes((prevTypes) => prevTypes.filter((type) => type !== value));
    }
  };

  const updateProfile = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      if (uploadProfileImage) {
        formData.append("profileImage", uploadProfileImage);
      } else {
        formData.append("img", "default");
      }
      // 프로필 데이터 추가
      if (sitterProfile.name) {
        formData.append("name", sitterProfile.name);
      }
      if (sitterProfile.address) {
        formData.append("address", sitterProfile.address);
      }
      if (sitterProfile.career) {
        formData.append("career", sitterProfile.career);
      }
      if (sitterProfile.type) {
        formData.append("type", sitterProfile.type);
      }
      if (sitterProfile.userid) {
        formData.append("userid", sitterProfile.userid);
      }
      if (sitterProfile.license) {
        formData.append("license", sitterProfile.license);
      }
      if (sitterProfile.oneLineIntro) {
        formData.append("oneLineIntro", sitterProfile.oneLineIntro);
      }
      if (sitterProfile.selfIntroduction) {
        formData.append("selfIntroduction", sitterProfile.selfIntroduction);
      }
      if (sitterProfile.pay) {
        formData.append("pay", sitterProfile.pay.toString());
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/profileUpdate`,
        formData
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const [disableInput, setDisableInput] = useState(false);

  // user Axios
  const updateUser = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      if (uploadUserImage) {
        formData.append("profileImage", uploadUserImage);
      } else {
        formData.append("img", "default");
      }

      if (userInfo.userid) {
        formData.append("userid", userInfo.userid);
      }
      // 프로필 데이터 추가
      if (userInfo.name) {
        formData.append("name", userInfo.name);
      }
      if (userInfo.address) {
        formData.append("address", userInfo.address);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/profileUpdate`,
        formData
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div className="outerContainer">
      {userInfo?.usertype === UserType.SITTER ? (
        !disableInput ? (
          <div className="innercontainer">
            <div className="imageContainer sections">
              <img src={sitterProfile.img} alt="Profile Image" className="myPage_profile_image" />
            </div>
            <div className="sectionsContainer">
              <div className="nameContainer sections">
                <div className="mypageTitle bordertopLeft">성함</div>
                <div className="inputDiv borderTopRight">
                  <input type="text" value={sitterProfile?.name} disabled />
                </div>
              </div>
              <div className="experienceContainer sections">
                <div className="mypageTitle">전문분야</div>
                <div className="inputDiv">
                  <input type="text" value={sitterProfile?.career} disabled />
                </div>
              </div>
              <div className="typesContainer sections">
                <div className="mypageTitle">종류</div>
                <div className="inputDiv">
                  <input
                    type="text"
                    value={sitterProfile?.type
                      ?.split(",")
                      .map((el) => setKoAnimalType(el))
                      .join(", ")}
                    disabled
                  />
                </div>
              </div>
              <div className="licenseContainer sections">
                <div className="mypageTitle">자격</div>
                <div className="inputDiv">
                  <input type="text" value={sitterProfile?.license} disabled />
                </div>
              </div>
              <div className="locationContainer sections">
                <div className="mypageTitle">방문위치</div>
                <div className="inputDiv">
                  <input type="text" value={sitterProfile?.address} disabled />
                </div>
              </div>
              <div className="priceContainer sections">
                <div className="mypageTitle">가격</div>
                <div className="inputDiv">
                  <input type="text" value={sitterProfile?.pay} disabled />
                </div>
              </div>
              <div className="introductionContainer sections">
                <div className="textAreaTitle  borderBottomLeft">자가소개</div>
                <div className="textAreaDiv borderBottomRight">
                  <textarea
                    className="textAreaContainer"
                    value={sitterProfile?.selfIntroduction}
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="myPageBtnContainer">
              <button className="myPageUpdateBtn" onClick={toggleModal}>
                채팅창
              </button>
              <button
                className="myPageUpdateBtn"
                onClick={() => {
                  setDisableInput(!disableInput);
                }}
              >
                수정
              </button>
            </div>
          </div>
        ) : (
          <div className="innercontainer">
            <div className="imageContainer">
              <img src={sitterProfile.img} alt="Profile Image" className="myPage_profile_image" />
              <div className="image_button_container">
                <label htmlFor="profileImage" className="label_profile_image">
                  프로필 변경
                </label>
                <input
                  type="file"
                  id="profileImage"
                  className="myPage_image_input"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const newUpdatedValue = {
                      ...sitterProfile,
                      img: URL.createObjectURL(e.target.files[0]),
                    };
                    setSitterProfile(newUpdatedValue);
                    setUploadProfileImage(e.target.files[0]);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUpdatedValue = {
                      ...sitterProfile,
                      img: "/images/PetStayLogo.png",
                    };
                    setSitterProfile(newUpdatedValue);
                    setUploadProfileImage(null);
                  }}
                >
                  기본 프로필
                </button>
              </div>
            </div>
            <div className="sectionsContainer">
              <div className="nameContainer sections">
                <div className="mypageTitle bordertopLeft">성함</div>
                <div className="inputDiv borderTopRight">
                  <input
                    type="text"
                    value={sitterProfile?.name}
                    onChange={(e) => {
                      const newUpdatedValue = { ...sitterProfile, name: e.target.value };
                      setSitterProfile(newUpdatedValue);
                    }}
                  />
                </div>
              </div>
              <div className="experienceContainer sections">
                <div className="mypageTitle">전문분야</div>
                <div className="inputDiv">
                  <input
                    type="text"
                    value={sitterProfile?.career}
                    onChange={(e) => {
                      const newUpdatedValue = { ...sitterProfile, career: e.target.value };
                      setSitterProfile(newUpdatedValue);
                    }}
                  />
                </div>
              </div>
              <div className="typesContainer sections">
                <div className="mypageTitle">종류</div>
                <div className="labelDiv">
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="dog"
                      checked={checkedTypes.includes("dog")}
                      onChange={handleCheckboxChange}
                    />
                    {"강아지"}
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="cat"
                      checked={checkedTypes.includes("cat")}
                      onChange={handleCheckboxChange}
                    />
                    {"고양이"}
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      type="checkbox"
                      name="animalType"
                      value="other"
                      checked={checkedTypes.includes("other")}
                      onChange={handleCheckboxChange}
                    />
                    {"기타"}
                  </label>
                </div>
              </div>
              <div className="licenseContainer sections">
                <div className="mypageTitle">자격</div>
                <div className="inputDiv">
                  <input
                    type="text"
                    value={sitterProfile?.license}
                    onChange={(e) => {
                      const newUpdatedValue = { ...sitterProfile, license: e.target.value };
                      setSitterProfile(newUpdatedValue);
                    }}
                  />
                </div>
              </div>
              <div className="locationContainer sections">
                <div className="mypageTitle">방문위치</div>
                <div className="inputDiv">
                  <input
                    type="text"
                    value={sitterProfile?.address}
                    onChange={(e) => {
                      const newUpdatedValue = { ...sitterProfile, address: e.target.value };
                      setSitterProfile(newUpdatedValue);
                    }}
                  />
                </div>
              </div>
              <div className="priceContainer sections">
                <div className="mypageTitle">가격</div>
                <div className="inputDiv">
                  <input
                    type="text"
                    value={sitterProfile?.pay}
                    onChange={(e) => {
                      const newUpdatedValue = { ...sitterProfile, pay: Number(e.target.value) };
                      setSitterProfile(newUpdatedValue);
                    }}
                  />
                </div>
              </div>
              <div className="introductionContainer sections">
                <div className="textAreaTitle  borderBottomLeft">자기소개</div>
                <div className="textAreaDiv borderBottomRight">
                  <textarea
                    className="textAreaContainer"
                    value={sitterProfile?.selfIntroduction}
                    onChange={(e) => {
                      const newUpdatedValue = {
                        ...sitterProfile,
                        selfIntroduction: e.target.value,
                      };
                      setSitterProfile(newUpdatedValue);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="myPageBtnContainer">
              <button
                className="myPageUpdateBtn"
                onClick={(e) => {
                  updateProfile(e);
                  setDisableInput(!disableInput);
                }}
              >
                {disableInput ? "완료" : "수정"}
              </button>
            </div>
          </div>
        )
      ) : !disableInput ? (
        <div className="innercontainer">
          <div className="imageContainer sections">
            <img src={userInfo.img} alt="Profile Image" className="myPage_profile_image" />
          </div>
          <div className="sectionsContainer">
            <div className="nameContainer sections">
              <div className="mypageTitle bordertopLeft">아이디</div>
              <div className="inputDiv borderTopRight">
                <input type="text" value={userInfo?.userid} disabled />
              </div>
            </div>
            <div className="experienceContainer sections">
              <div className="mypageTitle">성함</div>
              <div className="inputDiv">
                <input type="text" value={userInfo?.name} disabled />
              </div>
            </div>
            <div className="typesContainer sections">
              <div className="mypageTitle">주소</div>
              <div className="inputDiv">
                <input type="text" value={userInfo?.address} disabled />
              </div>
            </div>
          </div>
          <div className="myPageBtnContainer">
            <button className="myPageUpdateBtn" onClick={toggleModal}>
              채팅창
            </button>
            <button
              className="myPageUpdateBtn"
              onClick={() => {
                setDisableInput(!disableInput);
              }}
            >
              수정
            </button>
          </div>
        </div>
      ) : (
        <div className="innercontainer">
          <div className="imageContainer">
            <img src={userInfo.img} alt="Profile Image" className="myPage_profile_image" />
            <div className="image_button_container">
              <label htmlFor="profileImage" className="label_profile_image">
                프로필 변경
              </label>
              <input
                type="file"
                id="profileImage"
                className="myPage_image_input"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const newUpdatedValue = {
                    ...userInfo,
                    img: URL.createObjectURL(e.target.files[0]),
                  };
                  setUserInfo(newUpdatedValue);
                  setUploadUserImage(e.target.files[0]);
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const newUpdatedValue = {
                    ...userInfo,
                    img: "/images/PetStayLogo.png",
                  };
                  setUserInfo(newUpdatedValue);
                  setUploadUserImage(null);
                }}
              >
                기본 프로필
              </button>
            </div>
          </div>
          <div className="sectionsContainer">
            <div className="nameContainer sections">
              <div className="mypageTitle bordertopLeft">아이디</div>
              <div className="inputDiv borderTopRight">
                <input
                  type="text"
                  value={userInfo?.userid}
                  onChange={(e) => {
                    const newUpdatedValue = { ...userInfo, userid: e.target.value };
                    setUserInfo(newUpdatedValue);
                  }}
                />
              </div>
            </div>
            <div className="experienceContainer sections">
              <div className="mypageTitle">성함</div>
              <div className="inputDiv">
                <input
                  type="text"
                  value={userInfo?.name}
                  onChange={(e) => {
                    const newUpdatedValue = { ...userInfo, name: e.target.value };
                    setUserInfo(newUpdatedValue);
                  }}
                />
              </div>
            </div>
            <div className="licenseContainer sections">
              <div className="mypageTitle">주소</div>
              <div className="inputDiv">
                <input
                  type="text"
                  value={userInfo?.address}
                  onChange={(e) => {
                    const newUpdatedValue = { ...userInfo, address: e.target.value };
                    setUserInfo(newUpdatedValue);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="myPageBtnContainer">
            <button
              className="myPageUpdateBtn"
              onClick={(e) => {
                updateUser(e);
                setDisableInput(!disableInput);
              }}
            >
              {disableInput ? "완료" : "수정"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
