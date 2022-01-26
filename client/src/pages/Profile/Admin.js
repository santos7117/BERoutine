import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Tooltip } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AddClassPopupForm } from "../../components/AddClassForm/AddClassForm";
import { EditClassPopupForm } from "../../components/EditClass/EditClass";
import "./Profile.css";
import "../Routine/Routine.css";
// import adminProfilePic from "./BibhaSthapit.jpeg";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const apiClassUrl = "http://localhost:5000/api/class";

export default function Admin() {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <>
      <RoutineTable isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
    </>
  );
}

function RoutineTable(props) {
  const classes = useStyles();

  const { isUpdating, setIsUpdating } = props;
  const [routineData, setRoutineData] = useState();
  const datae = {};

  useEffect(async () => {
    let { data: res } = await axios.get(apiClassUrl);

    if (res && res.data) {
      res.data.map(item => {
        if (!datae[item.routineFor.programName]) {
          datae[item.routineFor.programName] = {};
        }
        if (!datae[item.routineFor.programName][item.weekDay]) {
          datae[item.routineFor.programName][item.weekDay] = {};
        }
        if (
          !datae[item.routineFor.programName][item.weekDay][item.startingPeriod]
        ) {
          datae[item.routineFor.programName][item.weekDay][
            item.startingPeriod
          ] = {};
        }
        datae[item.routineFor.programName][item.weekDay][item.startingPeriod] =
          item;
      });
    }

    setRoutineData(datae);
  }, []);

  const routineTable = {};
  const teacherTable = {};

  const createPeriodIndices = function () {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  };

  if (routineData) {
    // Add additional data for routine
    for (let program in routineData) {
      routineTable[program] = {
        sunday: createPeriodIndices(),
        monday: createPeriodIndices(),
        tuesday: createPeriodIndices(),
        wednesday: createPeriodIndices(),
        thursday: createPeriodIndices(),
        friday: createPeriodIndices(),
      };

      Object.keys(routineData[program]).map(weekDay => {
        Object.keys(routineData[program][weekDay]).map(startPeriod => {
          for (
            let period = parseInt(startPeriod) + 1;
            period <
            parseInt(startPeriod) +
              parseInt(routineData[program][weekDay][startPeriod].noOfPeriod);
            period++
          ) {
            delete routineTable[program][weekDay][
              routineTable[program][weekDay].indexOf(period)
            ];
          }
        });
      });
    }
  }

  // Loops through multiple teachers name &&
  // Creates a teacherTable
  function loopTeacher(teacherNames, idx, noOfPeriods) {
    let teacherArr = [];
    let name = "",
      id = "";

    for (let i = 0; i < teacherNames.length; i++) {
      name = teacherNames[i].teacherName;
      id = teacherNames[i]._id;

      // create or update teacherTable
      if (!teacherTable[id]) {
        teacherTable[id] = createPeriodIndices();
      } else {
        for (let j = --idx; j < idx + noOfPeriods; j++)
          delete teacherTable[id][j];
      }

      // push multiple teacherNames
      i === teacherNames.length - 1
        ? teacherArr.push(<>{name}</>)
        : teacherArr.push(<>{name} + </>);
    }
    return teacherArr;
  }

  function handleAddClassForm(program, day, index) {
    Modal.confirm({
      content: (
        <AddClassPopupForm
          program={program}
          day={day}
          index={index}
          teacherTable={teacherTable}
        />
      ),
      cancelButtonProps: { style: { display: "none" } },
      okButtonProps: { style: { display: "none" } },
      icon: "",
      width: 720,
    });
  }
  function handleEditClassForm(program, day, index, id) {
    Modal.confirm({
      content: (
        <EditClassPopupForm
          program={program}
          day={day}
          index={index}
          id={id}
          teacherTable={teacherTable}
        />
      ),
      cancelButtonProps: { style: { display: "none" } },
      okButtonProps: { style: { display: "none" } },
      icon: "",
      width: 720,
    });
  }
  function handleDeleteClassForm(id) {
    Modal.confirm({
      title: "Confirm deletion?",
      onOk: async () => {
        await axios.delete(`http://localhost:5000/api/class/delete/${id}`);
        window.location.reload();
      },
    });
  }

  return (
    <div>
      {routineData
        ? Object.keys(routineData).map(program => {
            return (
              <div>
                <h1
                  style={{
                    textAlign: "center",
                    fontSize: "55px",
                    fontWeight: 700,
                    marginTop: 30,
                  }}
                >
                  {program}
                </h1>
                <TableContainer
                  component={Paper}
                  style={{ paddingBottom: "80px" }}
                >
                  <Table className={classes.table} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Periods</TableCell>
                        <TableCell align="center">
                          Period 1<br></br>(10:15-11:05)
                        </TableCell>
                        <TableCell align="center">
                          Period 2<br></br>(11:05-11:55)
                        </TableCell>
                        <TableCell align="center">
                          Period 3<br></br>(11:55-12:45)
                        </TableCell>
                        <TableCell align="center">
                          Period 4<br></br>(12:45-01:35)
                        </TableCell>
                        <TableCell align="center">
                          Period 5<br></br>(01:35-02:25)
                        </TableCell>
                        <TableCell align="center">
                          Period 6<br></br>(02:25-03:15)
                        </TableCell>
                        <TableCell align="center">
                          Period 7<br></br>(03:15-04:05)
                        </TableCell>
                        <TableCell align="center">
                          Period 8<br></br>(04:05-04:55)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(routineTable[program]).map(day => {
                        return (
                          <TableRow className="relative" key={day}>
                            <TableCell
                              key={day}
                              className="border"
                              style={{ backgroundColor: "#D3D3DF" }}
                            >
                              {day.toUpperCase()}
                            </TableCell>
                            {routineTable[program][day].map(index => {
                              return routineData[program][day] &&
                                routineData[program][day][index] ? (
                                // {let noOfPeriod = routineData[program][day][index].noOfPeriod}
                                // return cell with class data
                                <TableCell
                                  key={index}
                                  align="center"
                                  className="border"
                                  style={{ backgroundColor: "#F0F0F0" }}
                                  colSpan={
                                    routineData[program][day][index].noOfPeriod
                                  }
                                >
                                  <b>
                                    {
                                      routineData[program][day][index]
                                        .subjectName
                                    }
                                  </b>
                                  <br></br>(
                                  <i>
                                    {loopTeacher(
                                      routineData[program][day][index]
                                        .teacherName,
                                      index,
                                      routineData[program][day][index]
                                        .noOfPeriod
                                    )}
                                  </i>
                                  )<br></br>[
                                  {routineData[program][day][index].classCode}]
                                  {/* {routineData[program][day][index]
                                    .classCode === "P"
                                    ? !labsTable[
                                        routineData[program][day][index]._id
                                      ]
                                      ? (labsTable[
                                          routineData[program][day][index]._id
                                        ] = createPeriodIndices())
                                      : delete labsTable[
                                          routineData[program][day][index]._id
                                        ][index - 1]
                                    : ""} */}
                                  <br></br>
                                  {` {Group: ${routineData[program][day][index].classGroup}}`}
                                  <br></br>
                                  <Tooltip
                                    title="Edit Class"
                                    placement="bottom"
                                  >
                                    <Button
                                      ghost
                                      type="dashed"
                                      size="small"
                                      onClick={() =>
                                        handleEditClassForm(
                                          program,
                                          day,
                                          index,
                                          routineData[program][day][index]._id
                                        )
                                      }
                                    >
                                      e
                                    </Button>
                                  </Tooltip>
                                  <Tooltip
                                    title="Delete Class"
                                    placement="bottom"
                                  >
                                    <Button
                                      ghost
                                      type="dashed"
                                      size="small"
                                      onClick={() =>
                                        handleDeleteClassForm(
                                          routineData[program][day][index]._id
                                        )
                                      }
                                    >
                                      d
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              ) : (
                                // return an empty cell
                                <TableCell
                                  key={index}
                                  align="center"
                                  className="border"
                                  colSpan={1}
                                >
                                  <Tooltip title="Add Class">
                                    <Button
                                      type="dashed"
                                      onClick={() =>
                                        handleAddClassForm(program, day, index)
                                      }
                                      ghost
                                    >
                                      +
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            );
          })
        : ""}
    </div>
  );
}
