import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Main from "./outlet/main/Main";
import Home from "./pages/home/Home";
import Product from "./pages/product/Product";

function App() {
	const router = createBrowserRouter(
		[
			{
				path: "",
				element: <Main />,
				children: [{ path: "", element: <Home /> }],
			},
			{
				path: "/product/:id",
				element: <Main />,
				children: [{ path: "", element: <Product /> }],
			},
		],
		{ basename: "/Nike-Store-v1" }
	);
	return <RouterProvider router={router} />;
}

export default App;
