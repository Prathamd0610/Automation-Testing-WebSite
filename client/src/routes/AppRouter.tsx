import { Suspense, lazy, type ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Spinner } from '@/components/ui/spinner';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Modules
const InputsPage = lazy(() => import('@/pages/modules/InputsPage'));
const ButtonsPage = lazy(() => import('@/pages/modules/ButtonsPage'));
const DropdownsPage = lazy(() => import('@/pages/modules/DropdownsPage'));
const CheckboxesPage = lazy(() => import('@/pages/modules/CheckboxesPage'));
const RadiosPage = lazy(() => import('@/pages/modules/RadiosPage'));
const SlidersPage = lazy(() => import('@/pages/modules/SlidersPage'));
const DatePickerPage = lazy(() => import('@/pages/modules/DatePickerPage'));
const DragDropPage = lazy(() => import('@/pages/modules/DragDropPage'));
const MouseActionsPage = lazy(() => import('@/pages/modules/MouseActionsPage'));
const KeyboardPage = lazy(() => import('@/pages/modules/KeyboardPage'));
const ModalsPage = lazy(() => import('@/pages/modules/ModalsPage'));
const TablesPage = lazy(() => import('@/pages/modules/TablesPage'));
const FileUploadPage = lazy(() => import('@/pages/modules/FileUploadPage'));
const AuthDemoPage = lazy(() => import('@/pages/modules/AuthDemoPage'));
const ApiTestingPage = lazy(() => import('@/pages/modules/ApiTestingPage'));
const WebSocketPage = lazy(() => import('@/pages/modules/WebSocketPage'));
const InfiniteScrollPage = lazy(() => import('@/pages/modules/InfiniteScrollPage'));
const ShadowDomPage = lazy(() => import('@/pages/modules/ShadowDomPage'));
const IframesPage = lazy(() => import('@/pages/modules/IframesPage'));

// Challenges
const NestedFramesPage = lazy(() => import('@/pages/modules/NestedFramesPage'));
const DynamicIdsPage = lazy(() => import('@/pages/challenges/DynamicIdsPage'));
const DelayedLoadingPage = lazy(() => import('@/pages/challenges/DelayedLoadingPage'));
const RandomElementsPage = lazy(() => import('@/pages/challenges/RandomElementsPage'));
const AjaxPage = lazy(() => import('@/pages/challenges/AjaxPage'));
const ToastsPage = lazy(() => import('@/pages/challenges/ToastsPage'));
const StaleElementsPage = lazy(() => import('@/pages/challenges/StaleElementsPage'));
const SpinnersPage = lazy(() => import('@/pages/challenges/SpinnersPage'));
const AlertsPage = lazy(() => import('@/pages/challenges/AlertsPage'));
const TooltipsPage = lazy(() => import('@/pages/challenges/TooltipsPage'));
const WizardPage = lazy(() => import('@/pages/challenges/WizardPage'));
const AutocompletePage = lazy(() => import('@/pages/challenges/AutocompletePage'));

// Workflows (protected)
const EcommercePage = lazy(() => import('@/pages/workflows/EcommercePage'));
const BankingPage = lazy(() => import('@/pages/workflows/BankingPage'));
const CrmPage = lazy(() => import('@/pages/workflows/CrmPage'));
const EmployeesPage = lazy(() => import('@/pages/workflows/EmployeesPage'));

// Admin (admin-only)
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAccountsPage = lazy(() => import('@/pages/admin/AdminAccountsPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminAuditLogPage = lazy(() => import('@/pages/admin/AdminAuditLogPage'));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner label="Loading module" />
    </div>
  );
}

function lazyElement(Component: ComponentType) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={lazyElement(LoginPage)} />
      <Route path="/register" element={lazyElement(RegisterPage)} />

      <Route element={<AppLayout />}>
        <Route index element={lazyElement(DashboardPage)} />

        {/* Section landing paths have no page of their own — redirect to the
            dashboard (the module / challenge / workflow catalog) instead of 404. */}
        <Route path="modules" element={<Navigate to="/" replace />} />
        <Route path="challenges" element={<Navigate to="/" replace />} />
        <Route path="workflows" element={<Navigate to="/" replace />} />

        <Route path="modules/inputs" element={lazyElement(InputsPage)} />
        <Route path="modules/buttons" element={lazyElement(ButtonsPage)} />
        <Route path="modules/dropdowns" element={lazyElement(DropdownsPage)} />
        <Route path="modules/checkboxes" element={lazyElement(CheckboxesPage)} />
        <Route path="modules/radios" element={lazyElement(RadiosPage)} />
        <Route path="modules/sliders" element={lazyElement(SlidersPage)} />
        <Route path="modules/date-picker" element={lazyElement(DatePickerPage)} />
        <Route path="modules/drag-drop" element={lazyElement(DragDropPage)} />
        <Route path="modules/mouse-actions" element={lazyElement(MouseActionsPage)} />
        <Route path="modules/keyboard" element={lazyElement(KeyboardPage)} />
        <Route path="modules/modals" element={lazyElement(ModalsPage)} />
        <Route path="modules/tables" element={lazyElement(TablesPage)} />
        <Route path="modules/file-upload" element={lazyElement(FileUploadPage)} />
        <Route path="modules/auth-demo" element={lazyElement(AuthDemoPage)} />
        <Route path="modules/api-testing" element={lazyElement(ApiTestingPage)} />
        <Route path="modules/websocket" element={lazyElement(WebSocketPage)} />
        <Route path="modules/infinite-scroll" element={lazyElement(InfiniteScrollPage)} />
        <Route path="modules/shadow-dom" element={lazyElement(ShadowDomPage)} />
        <Route path="modules/iframes" element={lazyElement(IframesPage)} />

        <Route path="challenges/nested-frames" element={lazyElement(NestedFramesPage)} />
        <Route path="challenges/dynamic-ids" element={lazyElement(DynamicIdsPage)} />
        <Route path="challenges/delayed-loading" element={lazyElement(DelayedLoadingPage)} />
        <Route path="challenges/random-elements" element={lazyElement(RandomElementsPage)} />
        <Route path="challenges/ajax" element={lazyElement(AjaxPage)} />
        <Route path="challenges/toasts" element={lazyElement(ToastsPage)} />
        <Route path="challenges/stale-elements" element={lazyElement(StaleElementsPage)} />
        <Route path="challenges/spinners" element={lazyElement(SpinnersPage)} />
        <Route path="challenges/alerts" element={lazyElement(AlertsPage)} />
        <Route path="challenges/tooltips" element={lazyElement(TooltipsPage)} />
        <Route path="challenges/wizard" element={lazyElement(WizardPage)} />
        <Route path="challenges/autocomplete" element={lazyElement(AutocompletePage)} />

        <Route element={<ProtectedRoute />}>
          <Route path="workflows/ecommerce" element={lazyElement(EcommercePage)} />
          <Route path="workflows/banking" element={lazyElement(BankingPage)} />
          <Route path="workflows/crm" element={lazyElement(CrmPage)} />
          <Route path="workflows/employees" element={lazyElement(EmployeesPage)} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin" element={lazyElement(AdminLayout)}>
            <Route index element={lazyElement(AdminDashboardPage)} />
            <Route path="users" element={lazyElement(AdminUsersPage)} />
            <Route path="accounts" element={lazyElement(AdminAccountsPage)} />
            <Route path="products" element={lazyElement(AdminProductsPage)} />
            <Route path="audit" element={lazyElement(AdminAuditLogPage)} />
            <Route path="notifications" element={lazyElement(AdminNotificationsPage)} />
          </Route>
        </Route>

        <Route path="*" element={lazyElement(NotFoundPage)} />
      </Route>
    </Routes>
  );
}
