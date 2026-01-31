import React, { useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { useSelector ,useDispatch} from "react-redux";
import { fetchMyProfile } from "../../features/profile/profileThunks";
const Header = ({ title }) => {

  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const { role } = useSelector((state) => state.auth);
  const user = profile;
  // console.log("User in Header:", user);
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl pl-10 md:pl-0 font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          {/* <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div> */}

          {/* Notifications */}
          {/* <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button> */}

          {/* User Avatar */}
          <div className="flex items-center cursor-pointer gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
