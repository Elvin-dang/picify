import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "../../../../shared/components/ConfirmModal";
import "./styles.scss";
import Input from "../../../../shared/components/Input";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { auth } from "../../../../config/firebase";
import { updateProfile } from "@firebase/auth";
import { message } from "antd";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../../../config/store";
import { setUserState } from "../../../../shared/slices/user.slice";

interface Props {
  photoURL: string | null;
  displayName: string | null;
  openEditProfileModal: boolean;
  onCancel: () => void;
  dispatch: AppDispatch;
}

const UpdateProfileModal = ({
  photoURL,
  displayName,
  openEditProfileModal,
  onCancel,
  dispatch,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const displayNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openEditProfileModal && displayNameRef.current && displayName) {
      displayNameRef.current.value = displayName;
    }
  }, [openEditProfileModal, displayName]);

  const handleUpdate = async () => {
    if (displayNameRef.current) {
      if (displayNameRef.current.value === "") {
        setError("Display name must not be empty");
        setTimeout(() => setError(undefined), 3000);
        return;
      }

      if (auth.currentUser) {
        try {
          setLoading(true);
          await updateProfile(auth.currentUser, {
            displayName: displayNameRef.current.value,
          });
          dispatch(setUserState({ displayName: displayNameRef.current.value }));
          setLoading(false);
          message.success("Update profile success");
          onCancel();
        } catch (err) {
          setLoading(false);
          message.error("Update profile fail");
          return;
        }
      }
    }
  };

  return (
    <ConfirmModal
      open={openEditProfileModal}
      onCancel={onCancel}
      width={600}
      confirmButton={
        <button onClick={handleUpdate}>
          {loading ? <LoadingOutlined /> : <CheckOutlined />} Update
        </button>
      }
    >
      <div className="editProfileModalContainer">
        <form>
          <div className="title">
            <img src={photoURL ? photoURL : "avatar.png"} alt="" />
          </div>
          <Input
            type="text"
            className="gate"
            label="Display Name"
            placeHolder="Display Name"
            refFromParent={displayNameRef}
            color="black"
            required={true}
            error={error}
          />
        </form>
      </div>
    </ConfirmModal>
  );
};

const mapState = ({ user }: RootState) => ({
  photoURL: user.photoURL,
  displayName: user.displayName,
});

export default connect(mapState)(UpdateProfileModal);
