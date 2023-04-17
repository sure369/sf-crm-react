import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import FAQ from "./scenes/faq";
import Accounts from "./scenes/accounts";
import Opportunities from "./scenes/opportunities";
import Leads from "./scenes/leads";
import Users from "./scenes/users";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import HomePage from "./scenes/home";
import DependentPicklist from "./scenes/formik/dependentPicklist";
import AccountForm from "./scenes/formik/AccountForm";
import ContactForm from "./scenes/formik/ContactForm";
import OpportunityForm from "./scenes/formik/OpportunityForm";
import LeadForm from "./scenes/formik/LeadForm";
import MaterialUIPickers from "./scenes/formik/datePick";
import FormikDepend from "./scenes/formik/formikDepend";
import LookupOption from "./scenes/formik/lookup";
import AppNavbar from "./scenes/global/AppNavbar";
import TestForm from "./scenes/formik/TestForm";
import AccountDetailPage from "./scenes/recordDetailPage/AccountDetailPage";
import ContactDetailPage from "./scenes/recordDetailPage/ContactDetailPage";
import LeadDetailPage from "./scenes/recordDetailPage/LeadDetailPage";
import OpportunityDetailPage from "./scenes/recordDetailPage/OpportunityDetailPage";
import NewForm from "./scenes/form";
import UserForm from "./scenes/formik/UserForm";
import UserDetailPage from "./scenes/recordDetailPage/UserDetailPage";
import InventoryForm from "./scenes/formik/InventoryForm";
import Inventories from "./scenes/inventories";
import InventoryDetailPage from "./scenes/recordDetailPage/InventoryDetailPage";
import EventForm from "./scenes/formik/EventForm";
import ComboBox from "./scenes/formik/lookup";

import NewEventForm from "./scenes/formik/NewEvent";
import FlexLeads from "./scenes/Flex/FlexLeads";
import FlexOpportunities from "./scenes/Flex/FlexOpportunities";
import FlexAccounts from "./scenes/Flex/FlexAccounts";
import FlexTasks from "./scenes/Flex/FlexTasks";
import TaskDetailPage from "./scenes/recordDetailPage/TaskDetailPage";
import Task from "./scenes/tasks";
import DataLoadPage from "./scenes/dataLoader/dataLoadPage";
import DropFileInput from "./scenes/fileUpload";
import JnOppInventoryDetailPage from "./scenes/recordDetailPage/JnOppInventoryDetailPage";
import OppInventoryJunction from "./scenes/OppInventory";
import FlexInventories from "./scenes/Flex/FlexInventory";
import TextEditor from "./scenes/RichTextField/TextEditor";
import Preview from "./scenes/fileUpload/Preview";
import CircularLoading from "./scenes/toast/CircularLoding";
import PicklistField from "./scenes/formik/PicklistField";
import FormikSelectMobile from "./scenes/formik/FormikSelectMobile";
import AccountsMobile from "./scenes/accounts/indexMobile";
import InventoriesMobile from "./scenes/inventories/indexMobile";
import ResponsiveAccounts from "./scenes/accounts/ResponsiveScreen";
import ResponsiveInventories from "./scenes/inventories/ResponsiveScreen";
import ResponsiveContacts from "./scenes/contacts/ResponsiveScreen";
import ResponsiveLeads from "./scenes/leads/ResponsiveScreen";
import ResponsiveOpportunities from "./scenes/opportunities/ResponsiveScreen";
import ResponsiveTasks from "./scenes/tasks/ResponsiveScreen";
import ResponsiveUsers from "./scenes/users/ResponsiveScreen";
import LoginIndex from "./scenes/login/LoginIndex";
import SignUpIndex from "./scenes/login/SignUpIndex";

import FooterComponnet from "./scenes/footer";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const [isAuthenticated,setIsAuthenticated] =useState(false)

  const handleAuthentication =()=>{
    setIsAuthenticated(true)
  }
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{height: "fit-content"}}>
          {/* <Sidebar isSidebar={isSidebar} /> */}
         
          <main className="content" style={{height: "fit-content"}}>
         
         {
          isAuthenticated ? <>
          
          
         <AppNavbar/>
         
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            <Routes>

            {/* <Route path ='/test' element={<LoginIndex/>} /> */}
              <Route path ='/test' element={<LoginIndex/>} />
           
              <Route path="/" element={< ResponsiveInventories/>} />
              <Route path="/accounts" element={<ResponsiveAccounts />} />
              <Route path="/contacts" element={<ResponsiveContacts />} />
              <Route path="/opportunities" element={<ResponsiveOpportunities />} />
              <Route path="/leads" element={<ResponsiveLeads />} />
              <Route path="/inventories" element={<ResponsiveInventories/>} />
              <Route path="/task" element={<ResponsiveTasks />} />
              <Route path="/users" element={<ResponsiveUsers />} />
              <Route path="/oppInventory" element={<OppInventoryJunction />} />
              
              <Route path="/new-contacts" element={<ContactForm />} />
              <Route path="/new-users" element={<UserForm/>} />
              {/* <Route path="/new-inventories" element={<InventoryForm/>}/> */}
              <Route path="/new-event" element={<EventForm/>}/>
              <Route path="/form" element={<NewForm />} />
              <Route path="/team" element={<Team />} />
              <Route path="/faq" element={<FAQ />} />

              <Route path="/dataLoader" element={<DataLoadPage/>} />
              <Route path ='/file' element={<DropFileInput/>} />
            
              <Route path ='/test1' element={<TestForm/>} />
              <Route path='/mobi' element={<AccountsMobile/>} />
              <Route path='/invmobi' element={<InventoriesMobile/>} />
               {/* <Route path ='/test' element={<ResponsiveScreen/>} />  */}
              

              <Route path="/new-inventories" element={<InventoryDetailPage/>} />
              <Route path="/new-leads" element={<LeadDetailPage />} />
              <Route path="/new-opportunities" element={<OpportunityDetailPage />} />
              <Route path="/new-accounts" element={<AccountDetailPage />} />
              <Route path ='/new-oppInventory' element={<JnOppInventoryDetailPage/>} />

              <Route path="/leadDetailPage" element={<FlexLeads/>}  />
              {/* <Route path="/leadDetailPage/:Id" element={<LeadDetailPage/>} /> */}
              <Route path="/opportunityDetailPage" element={<FlexOpportunities/>}/>
              {/* <Route path="/accountDetailPage/:id" element={<FlexAccounts/>} /> */}
              <Route path="/accountDetailPage" element={<FlexAccounts/>} />
              <Route path="/taskDetailPage" element={<TaskDetailPage/>}/>
              <Route path="/inventoryDetailPage" element={<FlexInventories/>}/>
              
              <Route path="/contactDetailPage" element={<ContactDetailPage/>} />

             
              <Route path ='/opportunityInventoryDetailPage' element={<JnOppInventoryDetailPage/>} />


             
             <Route path="/userDetailPage" element={<UserDetailPage/>} />
            <Route path="/test-date" element={<MaterialUIPickers/>} />
            
            </Routes>

            </>
            :
            <>
            {/* <LoginIndex onAuthentication={handleAuthentication} /> */}
            <Routes>
              <Route path='/' element={<LoginIndex onAuthentication={handleAuthentication}/>}/>
              <Route  path="/sign-up" element={<SignUpIndex/>} />
            </Routes>
            </>
            
         }
          </main>
         
        </div>
        {/* <FooterComponnet/> */}
      </ThemeProvider>
     </ColorModeContext.Provider>
  );
}

export default App;

