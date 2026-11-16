with open('src/components/Layout.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
old_import = '''import {
  Search,
  LogOut,
  Clock,
  Sparkles,
  Filter,
  ArrowUpDown,
  X,
  Tag,
  Key,
} from "lucide-react";'''

new_import = '''import toast from "react-hot-toast";
import {
  Search,
  LogOut,
  Clock,
  Sparkles,
  Filter,
  ArrowUpDown,
  X,
  Tag,
  Key,
  Lock,
} from "lucide-react";'''

content = content.replace(old_import, new_import)

# 2. Add state and submit handler
old_ref = 'const searchRef = useRef(null);'
new_ref_and_state = '''const searchRef = useRef(null);

  // Change Password Modal State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return toast.error("Current and new passwords are required.");
    }
    if (newPassword.length < 4) {
      return toast.error("New password must be at least 4 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setIsUpdatingPassword(true);
    try {
      const res = await window.api.changePassword?.({
        userId: user?.id,
        oldPassword,
        newPassword,
      });
      if (res?.success) {
        toast.success("Password updated successfully!");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error(err.message || "Error updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };'''

content = content.replace(old_ref, new_ref_and_state)

with open('src/components/Layout.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('[+] Fixed Layout.jsx cleanly!')

