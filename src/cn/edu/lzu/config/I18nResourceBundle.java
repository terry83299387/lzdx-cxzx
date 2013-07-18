package cn.edu.lzu.config;



import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;

public class I18nResourceBundle {

	public static Locale myLocale = Locale.getDefault();
	
	public String  myLanguage= Locale.getDefault().toString();

	public ResourceBundle bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));

   public I18nResourceBundle(){
	   
   }
    
	public  ResourceBundle setbundle() {
		HttpServletRequest request = (HttpServletRequest) ActionContext.getContext().get(ServletActionContext.HTTP_REQUEST);
		Object local = null;
		if(request==null){
			// default language
			bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));
			this.setMyLanguage("zh_CN");
			return bundle;
		} else {
			local=request.getSession().getAttribute("WW_TRANS_I18N_LOCALE");
		}
		if (local != null) {
			if (local.toString().equals("en_US")){
				bundle = ResourceBundle.getBundle("globalMessage", new Locale("en", "US", "WINDOWS"));
				this.setMyLanguage("en_US");
			}
			else{
				bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));
				this.setMyLanguage("zh_CN");
			}
		} else {
			bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));
			this.setMyLanguage("zh_CN");
		}
      return  bundle;
	}

	public void setBundle(String languageType) {
		if (languageType == null) {
			bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));
			this.setMyLanguage("zh_CN");
			return;
		}

		if (languageType.equals("zh_CN")){
			bundle = ResourceBundle.getBundle("globalMessage", new Locale("zh", "CN", "WINDOWS"));
			this.setMyLanguage("zh_CN");
		}
		else if (languageType.equals("en_US")){
			bundle = ResourceBundle.getBundle("globalMessage", new Locale("en", "US", "WINDOWS"));
			this.setMyLanguage("en_US");
		}
	}
	
	public static String getLanguage() {
		HttpServletRequest request = (HttpServletRequest) ActionContext.getContext().get(ServletActionContext.HTTP_REQUEST);
		Object local = request.getSession().getAttribute("WW_TRANS_I18N_LOCALE");
		if (local == null) {
			return "zh_CN";
		}
		
		// zh_CN
//		System.out.println("lanuage is " + local.toString());
		return local.toString();
	}
	
	public static void main(String[] args) {
		I18nResourceBundle  bundle=new I18nResourceBundle();
		System.out.println(bundle.myLanguage);
	}

	public ResourceBundle getBundle() {
		return bundle;
	}

	public static Locale getMyLocale() {
		return myLocale;
	}

	public static void setMyLocale(Locale myLocale) {
		I18nResourceBundle.myLocale = myLocale;
	}

	public String getMyLanguage() {
		return myLanguage;
	}

	public void setMyLanguage(String myLanguage) {
		this.myLanguage = myLanguage;
	}

}
