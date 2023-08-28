import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Show,
  Tabs,
  TabList,
  // TabPanels,
  Tab,
  // TabPanel,
} from "@chakra-ui/react";
import { FiHome, FiBox, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";
import { FC, ReactText, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../common/routes";

interface LinkItemProps {
  name: string;
  icon: IconType;
  to: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "City map", icon: FiHome, to: APP_ROUTES.HOME },
  { name: "Pokedex", icon: FiBox, to: APP_ROUTES.INVENTORY },
  { name: "Profile", icon: FiSettings, to: APP_ROUTES.PROFILE },
];

const SimpleSidebar: FC = ({ children }: any) => {
  const { isOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const index = LinkItems.findIndex((item) => item.to === pathname);
    setCurrentTab(index);
  }, [pathname]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>

      <Box
        w="100%"
        backgroundColor="white"
        position="fixed"
        left="0"
        bottom="0"
      >
        <Show breakpoint="(max-width: 567px)">
          <Tabs index={currentTab} isFitted>
            <TabList width="full">
              {LinkItems.map((tab) => (
                <Link key={tab.to} style={{ flex: 1 }} to={tab.to}>
                  <Tab height="60px" style={{ width: "100%" }}>
                    <Icon
                      mr="4"
                      fontSize="16"
                      _groupHover={{
                        color: "white",
                      }}
                      as={tab.icon}
                    />
                    {tab.name}
                  </Tab>
                </Link>
              ))}
            </TabList>
          </Tabs>
        </Show>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          PokeBish Go
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} to={link.to}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  to: string;
  children: ReactText;
}
const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
  return (
    <Link to={to}>
      <Box
        as="a"
        href="#"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cyan.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};

export default SimpleSidebar;
