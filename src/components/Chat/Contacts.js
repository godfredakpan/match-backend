
import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Logo from "../assets/logo.svg";

export default function Contacts({moderators, conversation, contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const data = await JSON.parse(
        localStorage.getItem('current-user')
      );
      console.log(data);
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    }

    fetchData();

}, []);

  const changeCurrentChat = (index, id, receiverId) => {

    const contact = getContact(id);

    const moderator = getModerator(receiverId);

    localStorage.setItem('current-moderator', JSON.stringify(moderator));

    setCurrentSelected(index);
    changeChat(contact);
  };

  function getContact(id) {

    const data = contacts.find((user) => user?._id === id);
    return data || null;
  }

  const getUserName = (id) => {
    const data = contacts.find((user) => user?._id === id);
    return data?.username || null;
  };

  function getModerator(id) {
    const data = moderators.find((user) => user?._id === id);

    return data || null;
  }

  return (
    <>
      {/* {currentUserImage && currentUserImage && ( */}
        <Container>
          <div className="brand">
            {/* <img src={'Logo'} alt="logo" />
            <h3>Match Day</h3> */}
          </div>
          <div className="contacts">
            {conversation.map((contact, index) => {
              return (
                <div
                  key={index}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact[0].users[0], contact[0].users[1])} // 0 is cli, 1 is moderator
                >
                  <div className="avatar">
                    {/* <img
                      src={`${contact.avatarImage}`}
                      alt=""
                      width={50}
                    /> */}
                  </div>
                  <div className="username">
                    <h3 style={{color: '#fff', textDecoration: 'capital'}}>{getUserName(contact[0].users[0])}:</h3>
                    <h3> {contact[0].message.text.length > 15 ? contact[0].message.text.substring(0, 15) + '...' : contact[0].message.text}</h3>
                  </div>
                </div>
              );
            })}
            
          </div>
        </Container>
      {/* )} */}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 5% 100% 15%;
  overflow: hidden;
  background-color: ##1d4d70;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.9rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.5rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 10rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0.2rem;
      padding: 0.3rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          margin-top: 15px;
          color: white;
          font-size: 0.8rem;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: ##bebec4;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        border-radius: 50% !important;
        overflow: hidden;
        width: 4rem;
        max-inline-size: 100%;
      }
    }
    .avatar{
      border-radius: 50%;
      overflow: hidden;
      width: 4rem;

    }
    .username {
      h4 {
        color: white;
        font-size: 1.2rem;

      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
