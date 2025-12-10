import { HStack, Stack, Table, Text } from "@chakra-ui/react";
import { useStyle } from "./theme";

export const TableCompo = (props: {
  tableName: String;
  description?: String;
  columns: any;
  data: any;
  currentLimit?: any;
  setCurrentPage?: any;
  setCurrentlimit?: any;
  additionalComponent?: any;
}) => {
  const style = useStyle();
  return props.data ? (
    <Stack
      maxWidth={"1440px"}
      width={{ base: "100vw", md: "100%" }}
      marginX={"auto"}
      marginBottom={"20px"}
      padding={"5px"}
      borderRadius={style.borderRadius}
      backgroundColor={style.backgroundContainer}
      border={style.customBorder}
    >
      <HStack justifyContent={"space-between"} flexWrap={"wrap"} padding={"20px"}>
        <Stack lineHeight={"1"}>
          <Text fontSize={"2xl"} color={style.primaryColor} as={"b"}>
            {props.tableName}
          </Text>
          <Text color={style.secondaryTextColor} fontSize={"12px"}>
            {props.description}
          </Text>
        </Stack>
        {props.additionalComponent}
      </HStack>
      <Stack overflowX={"auto"} maxHeight={"60vh"}>
        <Table.Root>
          <Table.Header fontSize={"md"}>
            <Table.Row border={"none"} backgroundColor={style.backgroundContainer} style={{ position: "sticky", top: 0, zIndex: 1 }}>
              {props.columns.map((cel: any, index: number) => (
                <Table.ColumnHeader
                  borderBottom={style.customBorder}
                  key={index}
                  textAlign={cel?.align === "right" ? "right" : "left"}
                  color={style.primaryTextColor}
                >
                  {cel.title}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body fontSize={"md"}>
            {props.data.map((row: any, index: number) => (
              <Table.Row key={index} backgroundColor={style.backgroundContainer}>
                {props.columns.map((column: any, index: number) => (
                  <Table.Cell
                    border={"none"}
                    key={index}
                    textAlign={column?.align === "right" ? "right" : "left"}
                    whiteSpace={"nowrap"}
                    color={style.secondaryTextColor}
                  >
                    {column.render ? column?.render(row) : row[column.key]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>

      {/* //pagination 
      {props.currentLimit < props.data.totalItems ? (
        <HStack justifyContent={"flex-end"} my={"20px"}>
          {props.data.prevPage != 1 && props.data.prevPage !== 0 ? (
            <>
              {props.data.prevPage - 1 > 1 ? (
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => props.setCurrentPage(props.data.prevPage)}
                >
                  <IoIosArrowBack />
                </Button>
              ) : null}
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => props.setCurrentPage(1)}
              >
                1
              </Button>
              {props.data.prevPage - 1 !== 1 ? (
                <Button size={"sm"} variant={"outline"}>
                  ...
                </Button>
              ) : null}
            </>
          ) : null}

          {props.data.prevPage != 0 ? (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => props.setCurrentPage(props.data.prevPage)}
            >
              {props.data.prevPage}
            </Button>
          ) : null}

          <Button
            size={"sm"}
            variant={"solid"}
            onClick={() => props.setCurrentPage(props.data.currentPage)}
          >
            {props.data.currentPage}
          </Button>
          {props.data.nextPage !== 0 ? (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => props.setCurrentPage(props.data.nextPage)}
            >
              {props.data.nextPage}
            </Button>
          ) : null}

          {props.data.nextPage != props.data.totalPages &&
          props.data.nextPage !== 0 ? (
            <>
              {props.data.nextPage + 1 !== props.data.totalPages ? (
                <Button size={"sm"} variant={"outline"}>
                  ...
                </Button>
              ) : null}

              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => props.setCurrentPage(props.data.totalPages)}
              >
                {props.data.totalPages}
              </Button>
              {props.data.totalPages - props.data.nextPage > 1 ? (
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => props.setCurrentPage(props.data.nextPage)}
                >
                  <IoIosArrowForward />
                </Button>
              ) : null}
            </>
          ) : null}

          <Stack>
            <Select
              value={props.currentLimit}
              onChange={(e) => {
                props.setCurrentlimit(e.target.value);
                props.setCurrentPage(1);
              }}
              backgroundColor={inputBackgroundColor()}
              border={customBorder()}
              color={inputColor()}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
          </Stack>
        </HStack>
      ) : null} */}
    </Stack>
  ) : null;
};
