import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setSelectedFriend(null);
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((f) => [...f, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend.id === selectedFriend?.id ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplit(value) {
    setFriends((curFriends) =>
      curFriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : { ...friend }
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill selectedFriend={selectedFriend} onSplit={handleSplit} key={selectedFriend.id} />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isEqual = selectedFriend?.id === friend.id;

  return (
    <li className={isEqual ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isEqual ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newItem = {
      name,
      image: `${image}?u=${id}`,
      id,
      balance: 0,
    };

    onAddFriend(newItem);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏽‍🤝‍🧑🏽 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whosePaid, setWhosePaid] = useState("user");
  const friendExpense = bill ? bill - userExpense : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;

    onSplit(whosePaid === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🧍‍♂️ Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          +e.target.value > bill
            ? setUserExpense(userExpense)
            : setUserExpense(+e.target.value)
        }
      />

      <label>👩🏾‍🤝‍🧑🏼 {selectedFriend.name}'s expense</label>
      <input type="text" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill ?</label>
      <select value={whosePaid} onChange={(e) => setWhosePaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
