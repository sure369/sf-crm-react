import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppNavbar from "../global/AppNavbar";
import ResponsiveAccounts from "../accounts/ResponsiveScreen";
import ResponsiveContacts from "../contacts/ResponsiveScreen";
import ResponsiveInventories from "../inventories/ResponsiveScreen";
import ResponsiveLeads from "../leads/ResponsiveScreen";
import ResponsiveOpportunities from "../opportunities/ResponsiveScreen";
import ResponsiveTasks from "../tasks/ResponsiveScreen";
import ResponsiveUsers from "../users/ResponsiveScreen";
import ContactDetailPage from "../recordDetailPage/ContactDetailPage";
import AccountDetailPage from "../recordDetailPage/AccountDetailPage";
import LeadDetailPage from "../recordDetailPage/LeadDetailPage";
import OpportunityDetailPage from "../recordDetailPage/OpportunityDetailPage";
import InventoryDetailPage from "../recordDetailPage/InventoryDetailPage";
import TaskDetailPage from "../recordDetailPage/TaskDetailPage";
import UserDetailPage from "../recordDetailPage/UserDetailPage";
import FlexAccounts from "../Flex/FlexAccounts";
import FlexInventories from "../Flex/FlexInventory";
import FlexLeads from "../Flex/FlexLeads";
import FlexOpportunities from "../Flex/FlexOpportunities";
import FlexTasks from "../Flex/FlexTasks";
import PageNotFound from "../Errors/PageNotFound";
import HomePage from "../home";
import PermissionSetDetailPage from "../recordDetailPage/PermissionSetDetailPage";
import FileUpload from "../fileUpload/FileUpload";
import PermissionSets from "../permissionSets";
import RoleDetailPage from "../recordDetailPage/RoleDetailPage";
import RoleIndex from "../roles";
import Files from "../Files";

function LoginLayoutIndex() {
  return (
    <>
    
    {/* <AppNavbar /> */}
      <Routes>
        <Route path="/" exact element={<ResponsiveAccounts />} />
        {/* <Route path="/" exact element={<HomePage />} /> */}
        <Route path="/list/account" element={<ResponsiveAccounts />} />
        <Route path="/list/contact" element={<ResponsiveContacts />} />
        <Route path="/list/deal" element={<ResponsiveOpportunities />} />
        <Route path="/list/enquiry" element={<ResponsiveLeads />} />
        <Route path="/list/inventory" element={<ResponsiveInventories />} />
        <Route path="/list/event" element={<ResponsiveTasks />} />
        <Route path="/list/user" element={<ResponsiveUsers />} />
        <Route path="/list/permissions" element={<PermissionSets />} />
        <Route path="/list/role" element={<RoleIndex />} />
        <Route path="/list/files" element={<Files />} />
        {/* <Route path="/list/files" element={<FileUpload />} /> */}


        <Route path="/new-contacts" element={<ContactDetailPage />} />
        <Route path="/new-users" element={<UserDetailPage />} />
        <Route path="/new-task" element={<TaskDetailPage />} />
        <Route path="/new-inventories" element={<InventoryDetailPage />} />
        <Route path="/new-leads" element={<LeadDetailPage />} />
        <Route path="/new-opportunities" element={<OpportunityDetailPage />} />
        <Route path="/new-accounts" element={<AccountDetailPage />} />        
        <Route path="/new-permission" element={<PermissionSetDetailPage />} />
        <Route path="/new-roles" element={<RoleDetailPage />} />        

        <Route path="/accountDetailPage/:id" element={<FlexAccounts />} />
        <Route path="/taskDetailPage/:id" element={<FlexTasks />} />
        <Route path="/inventoryDetailPage/:id" element={<FlexInventories />} />
        <Route path="/contactDetailPage/:id" element={<ContactDetailPage />} />
        <Route path="/userDetailPage/:id" element={<UserDetailPage />} />
        <Route path="/leadDetailPage/:id" element={<FlexLeads />} />
        <Route path="/roleDetailPage/:id" element={<RoleDetailPage/>}/>
        <Route path="/opportunityDetailPage/:id" element={<FlexOpportunities />}/>
        <Route path="/permissionDetailPage/:id" element={<PermissionSetDetailPage />}/>

        
        <Route path="/Home" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default LoginLayoutIndex;
