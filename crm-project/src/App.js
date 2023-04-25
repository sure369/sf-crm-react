import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginLayoutIndex from "./scenes/Layout/LoginIndex";
import LogoutLayoutIndex from "./scenes/Layout/LogoutIndex";

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const handleAuthentication = () => {
    navigate("/");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ height: "fit-content" }}>
          <main className="content" style={{ height: "fit-content" }}>
            {sessionStorage.getItem("token") ? (
              <>
                <LoginLayoutIndex />
              </>
            ) : (
              <>
              <LogoutLayoutIndex/>
              </>
            )}
          </main>
        </div>
        {/* <FooterComponnet/> */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

//login --log out
// return (
//   <ColorModeContext.Provider value={colorMode}>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <div className="app" style={{ height: "fit-content" }}>
//         {/* <Sidebar isSidebar={isSidebar} /> */}

//         <main className="content" style={{ height: "fit-content" }}>
//           {isAuthenticated ? (
//             <>
//               <AppNavbar />
//               <Routes>
//                 <Route path="/" element={<ResponsiveInventories />} />
//                 <Route path="/accounts" element={<ResponsiveAccounts />} />
//                 <Route path="/contacts" element={<ResponsiveContacts />} />
//                 <Route path="/opportunities" element={<ResponsiveOpportunities />}/>
//                 <Route path="/leads" element={<ResponsiveLeads />} />
//                 <Route path="/inventories" element={<ResponsiveInventories />}/>
//                 <Route path="/task" element={<ResponsiveTasks />} />
//                 <Route path="/users" element={<ResponsiveUsers />} />

//                 <Route path="/new-contacts" element={<ContactForm />} />
//                 <Route path="/new-users" element={<UserForm />} />
//                 <Route path="/new-event" element={<EventForm />} />
//                 <Route path="/new-inventories" element={<InventoryDetailPage />}/>
//                 <Route path="/new-leads" element={<LeadDetailPage />} />
//                 <Route path="/new-opportunities" element={<OpportunityDetailPage />}/>
//                 <Route path="/new-accounts" element={<AccountDetailPage />} />
//                 <Route path="/new-oppInventory" element={<JnOppInventoryDetailPage />}/>

//                 <Route path="/accountDetailPage" element={<FlexAccounts />} />
//                 <Route path="/taskDetailPage" element={<TaskDetailPage />} />
//                 <Route path="/inventoryDetailPage" element={<FlexInventories />}/>
//                 <Route path="/contactDetailPage" element={<ContactDetailPage />}/>
//                 <Route path="/userDetailPage" element={<UserDetailPage />} />
//                 <Route path="/leadDetailPage" element={<FlexLeads />} />
//                 <Route path="/opportunityDetailPage" element={<FlexOpportunities />}/>

//                 {/* <Route path="/leadDetailPage/:Id" element={<LeadDetailPage/>} /> */}
//                 {/* <Route path="/accountDetailPage/:id" element={<FlexAccounts/>} /> */}

//                 <Route path="/dataLoader" element={<DataLoadPage />} />
//                 <Route path="/file" element={<DropFileInput />} />

//                 {/* <Route path='/mobi' element={<AccountsMobile/>} />
//                     <Route path='/invmobi' element={<InventoriesMobile/>} />
//                     <Route path ='/test' element={<ResponsiveScreen/>} />
//                 */}
//               </Routes>
//             </>
//           ) : (
//             <>
//               {/* <LoginIndex onAuthentication={handleAuthentication} /> */}
//               <Routes>
//                 <Route path="/" element={<LoginIndex onAuthentication={handleAuthentication}/>} />
//                 <Route path="/sign-up" element={<SignUpIndex />} />
//               </Routes>
//             </>
//           )}
//         </main>
//       </div>
//       {/* <FooterComponnet/> */}
//     </ThemeProvider>
//   </ColorModeContext.Provider>
// );
