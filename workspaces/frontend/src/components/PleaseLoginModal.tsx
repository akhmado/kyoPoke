import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { APP_ROUTES } from "../common/routes";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function PleaseLoginModal({ isOpen, onClose }: Props) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Please log in or sign up</Text>
        </ModalHeader>
        <ModalBody>
          <Text>
            This action requires you to be authenticated please log in or sign
            up to the platform
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button mr="2" onClick={onClose}>
            Close
          </Button>
          <Link to={APP_ROUTES.PROFILE}>
            <Button colorScheme="green">Log in / Sign up</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PleaseLoginModal;
