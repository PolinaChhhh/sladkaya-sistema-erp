
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Страница не найдена
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Вернуться на главную</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
