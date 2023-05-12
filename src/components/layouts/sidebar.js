
import 'material-react-toastify/dist/ReactToastify.css';

const SideBar = () => {
    return (
        <>
            <div class="sidebar">

                <div class="sidebar-wrapper">
                    <div class="logo">
                        <a href="#" class="simple-text logo-mini">

                            <img src="" width="30px" alt="Name" />

                        </a>
                        <a href="#" class="simple-text logo-normal">
                            Godfred
                        </a>
                    </div>
                    <ul class="nav">

                        <li class="{{ Request::is('dashboard') ? 'active' : '' }}">
                            <a href="{{ route('dashboard') }}">
                                <i class="tim-icons icon-chart-pie-36"></i>
                                <p>Client Home</p>
                            </a>
                        </li>


                        <li class="{{ Request::is('dashboard/users/profile') ? 'active' : '' }}">
                            <a href="{{ route('profile.user') }}">
                                <i class="tim-icons icon-single-02 "></i>
                                <p>Profile</p>
                            </a>
                        </li>

                        <li class="">
                            <a href="#account" data-toggle="collapse" aria-expanded="true">
                                <i class="tim-icons icon-chart-bar-32"></i>
                                <p>Account Cabinet<b class="caret"></b></p>
                            </a>
                        </li>

                        <li class="{{ Request::is('dashboard/users/profile') ? 'active' : '' }}">
                            <a href="{{ route('profile.user') }}">
                                <i class="tim-icons icon-key-25 "></i>
                                <p>Change Password</p>
                            </a>
                        </li>

                        <li>
                            <a href="{{ route('profile.user') }}">
                                <i class="tim-icons icon-refresh-02"></i>
                                <p>Logout</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default SideBar;
