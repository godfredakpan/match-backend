/* eslint-disable jsx-a11y/anchor-is-valid */

import 'material-react-toastify/dist/ReactToastify.css';

const NavBar = () => {

    const logout = () => {
        localStorage.removeItem('current-user');
        window.location.href = "/login";
    }

    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-sticky">
                <div class="container-fluid">
                    <div class="navbar-wrapper">
                        <div class="navbar-toggle d-inline">
                            <button type="button" class="navbar-toggler">
                                <span class="navbar-toggler-bar bar1"></span>
                                <span class="navbar-toggler-bar bar2"></span>
                                <span class="navbar-toggler-bar bar3"></span>
                            </button>
                        </div>
                        <a class="navbar-brand" href="/">
                            <img class="img-responsive" style={{width: '10%'}}
                                src="" alt="" />Chat Home Base</a>
                            

                    </div>

                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-bar navbar-kebab"></span>
                        <span class="navbar-toggler-bar navbar-kebab"></span>
                        <span class="navbar-toggler-bar navbar-kebab"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navigation">
                        <ul class="navbar-nav ml-auto">
                            <li class="dropdown nav-item">
                                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                                    <div class=" d-none d-lg-block d-xl-block"></div>
                                    <i class="tim-icons"></i>
                                    <p class="d-lg-none">
                                        Notifications
                                    </p>
                                </a>
                            </li>

                            <li class="dropdown nav-item">
                                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                                    <div class="">
                                    Admin
                                    </div>
                                    <b class="caret d-none d-lg-block d-xl-block"></b>
                                    <p onClick={() => logout()} class="d-lg-none">
                                        Log out
                                    </p>
                                </a>
                                <ul class="dropdown-menu dropdown-navbar">
                                    <li class="nav-link"><a onClick={() => logout()} href="#"
                                        class="nav-item dropdown-item">Logout</a></li>

                                    <li class="nav-link"><a onClick={() => window.location.href = "/admin"} href="#"
                                    class="nav-item dropdown-item">Admin</a></li>
                                </ul>
                            </li>
                            <li class="separator d-lg-none"></li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
};

export default NavBar;
